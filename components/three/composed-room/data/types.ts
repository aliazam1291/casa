export type Vec3 = [number, number, number];

export type TextureKey = "marble" | "marble2" | "travertine" | "portrait";

export type StaggerGroup = "walls" | "furniture" | "sculpture" | "art" | "accents";

export type GeometrySpec =
  | { kind: "box"; args: Vec3 }
  | { kind: "cylinder"; args: [number, number, number, number?] }
  | { kind: "sphere"; args: [number, number?, number?] };

export type MaterialSpec =
  | { kind: "matte" }
  | { kind: "ground" }
  | { kind: "textured"; map: TextureKey; roughness?: number };

export interface RoomPart {
  id: string;
  geometry: GeometrySpec;
  material: MaterialSpec;
  position: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
}

export interface RoomObject {
  id: string;
  group: StaggerGroup;
  /** null = decorative/architectural — no hover label, no click-through. */
  label: string | null;
  href: string | null;
  cursorLabel?: string;
  /** Invisible raycast proxy box — {size, center} — so hover doesn't flicker between a cluster's parts. */
  hitbox?: { size: Vec3; center: Vec3 };
  /** Y-offset the cluster drops in from during assembly. */
  dropFrom?: number;
  parts: RoomPart[];
}
