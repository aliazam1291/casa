/* eslint-disable */
// Furniture-level interactivity: tag a mesh/group with the piece's name,
// materials and a short description so the visitor can hover it in the 3D
// scene and read what it is made of — the "eye" moment from the reference.

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

/** Walk up from a raycast hit to the tagged piece, if any. */
export function findPiece(object) {
  let node = object;
  while (node) {
    if (node.userData && node.userData.pieceInfo) return node;
    node = node.parent;
  }
  return null;
}
