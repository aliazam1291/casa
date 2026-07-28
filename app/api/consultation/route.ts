import { NextResponse } from "next/server";

/**
 * Consultation requests, with the photographs the customer brings.
 *
 * "Bring the evidence" is the first stage of the room audit, so the images
 * are the point of this endpoint, not a nicety — the whole enquiry is
 * accepted as multipart/form-data.
 *
 * TRANSPORT: there is no mail provider configured for this project yet, and
 * an endpoint that silently accepted enquiries and dropped them would be
 * worse than one that says so. Set CONSULTATION_WEBHOOK_URL to any endpoint
 * that accepts a multipart POST (a form backend, a CRM inbox, a Zap) and the
 * enquiry is forwarded there verbatim. Without it this returns 501 and the
 * form falls back to showing the showroom's real phone number.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 6;
const MAX_BYTES = 8 * 1024 * 1024; // 8MB per image
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Could not read the form." }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim();
  const contact = String(form.get("contact") ?? "").trim();
  const scope = String(form.get("scope") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please give us a name to call you by." }, { status: 400 });
  }
  if (contact.length < 6) {
    return NextResponse.json({ ok: false, error: "Please leave a phone number or email." }, { status: 400 });
  }

  const images = form.getAll("images").filter((v): v is File => v instanceof File && v.size > 0);

  if (images.length > MAX_FILES) {
    return NextResponse.json({ ok: false, error: `Up to ${MAX_FILES} photographs, please.` }, { status: 400 });
  }
  for (const image of images) {
    if (!ALLOWED.includes(image.type)) {
      return NextResponse.json({ ok: false, error: `${image.name} is not an image we can read.` }, { status: 400 });
    }
    if (image.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: `${image.name} is larger than 8MB.` }, { status: 400 });
    }
  }

  const webhook = process.env.CONSULTATION_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        ok: false,
        code: "NO_TRANSPORT",
        error: "We could not submit that from here yet.",
      },
      { status: 501 }
    );
  }

  const outbound = new FormData();
  outbound.set("name", name);
  outbound.set("contact", contact);
  outbound.set("scope", scope);
  outbound.set("message", message);
  outbound.set("received", new Date().toISOString());
  images.forEach((image) => outbound.append("images", image, image.name));

  try {
    const response = await fetch(webhook, { method: "POST", body: outbound });
    if (!response.ok) throw new Error(`Upstream responded ${response.status}`);
  } catch {
    return NextResponse.json({ ok: false, error: "We could not submit that just now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
