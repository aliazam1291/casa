/* eslint-disable */
// Furniture-level interactivity: tag a mesh/group with the piece's name,
// materials and a short description so the visitor can hover it in the 3D
// scene and read what it is made of — the "eye" moment from the reference.
import { PIECES_BY_ID } from '@/lib/pieces';

/**
 * Mark an object (and everything under it) as one interactive furniture piece.
 * The whole subtree points back at the same record so a raycast hit on any
 * child resolves to the piece as a whole.
 */
export function tagPiece(object, info) {
  if (!object) return object;
  object.userData.pieceInfo = info;
  object.traverse((child) => {
    child.userData.pieceRoot = object;
  });
  return object;
}

/**
 * Same as tagPiece(), but looks the {name, materials, description} up from
 * lib/pieces.ts by id instead of taking a literal object — the single
 * source of truth also used to generate /pieces/[slug] and /rooms/[slug].
 * pieceInfo() returns exactly the shape tagPiece() has always received, so
 * this is a drop-in replacement with byte-identical hover copy.
 */
export function tagPieceById(object, id) {
  const p = PIECES_BY_ID[id];
  if (!p) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`tagPieceById: unknown piece id "${id}" — check lib/pieces.ts`);
    }
    return tagPiece(object, { name: id, materials: [], description: '' });
  }
  return tagPiece(object, { name: p.name, materials: p.materials, description: p.description });
}

/** Walk up from a raycast hit to the tagged piece, if any. */
export function findPiece(object) {
  let node = object;
  while (node) {
    if (node.userData && node.userData.pieceInfo) return node;
    node = node.parent;
  }
  return null;
}
