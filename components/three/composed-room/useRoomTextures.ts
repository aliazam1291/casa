"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { TEXTURE_URLS } from "./data/textures";
import type { TextureKey } from "./data/types";

type TextureRecord = Partial<Record<TextureKey, THREE.Texture | null>>;

const loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");

function loadWithTimeout(url: string, ms = 6000): Promise<THREE.Texture | null> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, ms);

    loader.load(
      url,
      (tex) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        resolve(tex);
      },
      undefined,
      () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(null);
      },
    );
  });
}

/**
 * Loads the four Unsplash textures used by the marble slabs and portrait.
 * Never throws — a failed/slow fetch resolves to `null` for that key, and
 * RoomPartMesh falls back to flat cream rather than erroring the scene.
 */
export function useRoomTextures() {
  const [textures, setTextures] = useState<TextureRecord>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const keys = Object.keys(TEXTURE_URLS) as TextureKey[];

    Promise.all(keys.map((key) => loadWithTimeout(TEXTURE_URLS[key]))).then((results) => {
      if (cancelled) return;
      const record: TextureRecord = {};
      keys.forEach((key, i) => {
        record[key] = results[i];
      });
      setTextures(record);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Dispose all loaded textures on unmount — Wolf_Casa_3D_Concept_v3.md
  // "Non-negotiables": dispose geometry/material/renderer on unmount.
  useEffect(() => {
    return () => {
      Object.values(textures).forEach((tex) => tex?.dispose());
    };
  }, [textures]);

  return { textures, loaded };
}
