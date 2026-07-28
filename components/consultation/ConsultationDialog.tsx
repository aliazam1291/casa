"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CONTACT } from "@/lib/contact";
import { useCursor } from "@/components/cursor/CursorProvider";
import styles from "./ConsultationDialog.module.css";

/**
 * Booking the room audit. The first stage of the audit is "bring the
 * evidence", so photographs are the substance of this form rather than an
 * afterthought — drag a few in, or pick them, and they preview as a contact
 * sheet before anything is sent.
 *
 * Built on Radix Dialog rather than shadcn/ui: shadcn ships Tailwind-classed
 * source, and this project has no Tailwind — the design system is 36 CSS
 * Modules. Radix is the same headless primitive shadcn is built on, so the
 * behaviour (focus trap, ESC, scroll lock, ARIA wiring) is identical and the
 * look stays ours.
 */

const MAX_FILES = 6;
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const SCOPES = ["A single room", "A whole floor", "The whole house", "A commercial space"];

type Attachment = { id: string; file: File; url: string };
type Status = "idle" | "sending" | "sent" | "error";

export function ConsultationDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [scope, setScope] = useState(SCOPES[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setCursor, resetCursor } = useCursor();

  // Object URLs are revoked on removal and on unmount; leaking them would
  // pin every photograph the visitor ever previewed into memory.
  useEffect(() => {
    return () => {
      attachments.forEach((a) => URL.revokeObjectURL(a.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      setProblem(null);
      const accepted: Attachment[] = [];

      for (const file of Array.from(incoming)) {
        if (!ALLOWED.includes(file.type)) {
          setProblem(`${file.name} is not an image we can read.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          setProblem(`${file.name} is larger than 8MB.`);
          continue;
        }
        accepted.push({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          url: URL.createObjectURL(file),
        });
      }

      setAttachments((prev) => {
        const seen = new Set(prev.map((a) => a.id));
        const fresh = accepted.filter((a) => !seen.has(a.id));
        const room = MAX_FILES - prev.length;
        if (fresh.length > room) setProblem(`Up to ${MAX_FILES} photographs, please.`);
        // Anything we reject here still holds an object URL — release it.
        fresh.slice(room).forEach((a) => URL.revokeObjectURL(a.url));
        return [...prev, ...fresh.slice(0, Math.max(room, 0))];
      });
    },
    []
  );

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set("scope", scope);
    form.delete("images");
    attachments.forEach((a) => form.append("images", a.file, a.file.name));

    setStatus("sending");
    setProblem(null);
    try {
      const response = await fetch("/api/consultation", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.ok) {
        setStatus("sent");
        return;
      }
      setStatus("error");
      setProblem(data.error ?? "We could not submit that just now.");
    } catch {
      setStatus("error");
      setProblem("We could not submit that just now.");
    }
  };

  const reset = () => {
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setAttachments([]);
    setStatus("idle");
    setProblem(null);
    setScope(SCOPES[0]);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          resetCursor();
          reset();
        }
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={`${styles.content} leather`}>
          <Dialog.Close
            className={styles.close}
            aria-label="Close"
            onMouseEnter={() => setCursor("hover", "Close")}
            onMouseLeave={resetCursor}
          >
            ×
          </Dialog.Close>

          {status === "sent" ? (
            <div className={styles.done}>
              <span className={styles.eyebrow}>Received</span>
              <Dialog.Title className={styles.title}>We have your room.</Dialog.Title>
              <Dialog.Description className={styles.lede}>
                One of our designers will read what you sent and come back to you with a first direction — not a quote.
              </Dialog.Description>
              <button type="button" className={styles.secondary} onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <header className={styles.head}>
                <span className={styles.eyebrow}>Signature Consultation</span>
                <Dialog.Title className={styles.title}>Book the room audit.</Dialog.Title>
                <Dialog.Description className={styles.lede}>
                  Bring the evidence — plans, photographs, the corner that has never worked. We read proportion, light
                  and ritual before anything is specified.
                </Dialog.Description>
              </header>

              <div className={styles.grid}>
                <label className={styles.field}>
                  <span>Your name</span>
                  <input name="name" required minLength={2} autoComplete="name" placeholder="Ananya Rao" />
                </label>
                <label className={styles.field}>
                  <span>Phone or email</span>
                  <input name="contact" required minLength={6} autoComplete="tel" placeholder="+91 …" />
                </label>
              </div>

              <fieldset className={styles.scopes}>
                <legend>What are we composing?</legend>
                <div className={styles.scopeRow}>
                  {SCOPES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={scope === option ? styles.scopeChipActive : styles.scopeChip}
                      onClick={() => setScope(option)}
                      aria-pressed={scope === option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className={styles.field}>
                <span>What is not working?</span>
                <textarea name="message" rows={3} placeholder="The living room takes light beautifully until four, and then it dies." />
              </label>

              {/* ── the evidence ───────────────────────────────── */}
              <div
                className={dragging ? styles.dropActive : styles.drop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addFiles(e.dataTransfer.files);
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  name="images"
                  accept={ALLOWED.join(",")}
                  multiple
                  className={styles.fileInput}
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <button type="button" className={styles.dropInner} onClick={() => inputRef.current?.click()}>
                  <span className={styles.dropTitle}>Attach photographs of the room</span>
                  <span className={styles.dropHint}>
                    Drag them here or browse · up to {MAX_FILES} images · JPG, PNG, WebP, HEIC
                  </span>
                </button>
              </div>

              {attachments.length > 0 && (
                <ul className={styles.sheet}>
                  {attachments.map((a) => (
                    <li key={a.id} className={styles.thumb}>
                      <Image src={a.url} alt={a.file.name} fill sizes="120px" unoptimized />
                      <button
                        type="button"
                        className={styles.thumbRemove}
                        onClick={() => removeAttachment(a.id)}
                        aria-label={`Remove ${a.file.name}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {problem && (
                <p className={styles.problem} role="alert">
                  {problem}
                  {status === "error" && CONTACT.phone && (
                    <>
                      {" "}
                      Call the showroom on{" "}
                      <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}>{CONTACT.phone}</a> and we will take it from
                      there.
                    </>
                  )}
                </p>
              )}

              <button
                type="submit"
                className={styles.submit}
                disabled={status === "sending"}
                onMouseEnter={() => setCursor("hover", "Send")}
                onMouseLeave={resetCursor}
              >
                {status === "sending" ? "Sending…" : "Request the audit"}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
