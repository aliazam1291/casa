/* eslint-disable */
"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FLOORS } from "@/lib/rooms";

// Maps the 2D plan's SVG-style coordinate space (the same 0-100 x / 0-96 y
// system the old flat blueprint used) onto the XZ plane of this 3D scene.
// Keeping the same source numbers as lib/rooms.ts means a room's footprint
// here is never a second, drifting copy of its geometry.
const SCALE = 0.115;
const CENTER_X = 50;
const CENTER_Z = 48;
const ENVELOPE = { x: 10, y: 10, w: 80, h: 76 };
const WALL_HEIGHT = 1.35; // real volume, not a flat card
const FLOOR_GAP = 3.4; // centre-to-centre; leaves ~2 units of clear air between slabs — "drawn apart"

const GOLD = 0xa78657;
const IVORY = 0xe8e1d3;

function toWorld(svgX, svgY) {
  return [(svgX - CENTER_X) * SCALE, (svgY - CENTER_Z) * SCALE];
}

function rectCorners(rect) {
  const [x0, z0] = toWorld(rect.x, rect.y);
  const [x1, z1] = toWorld(rect.x + rect.w, rect.y + rect.h);
  return [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1],
  ];
}

function rectSize(rect) {
  const [x0, z0] = toWorld(rect.x, rect.y);
  const [x1, z1] = toWorld(rect.x + rect.w, rect.y + rect.h);
  return { w: x1 - x0, d: z1 - z0, cx: (x0 + x1) / 2, cz: (z0 + z1) / 2 };
}

function makeLineLoop(rect, y, color, opacity) {
  const corners = rectCorners(rect);
  const points = [...corners, corners[0]].map(([x, z]) => new THREE.Vector3(x, y, z));
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geo, mat);
}

const VillaScene = forwardRef(function VillaScene({ onRoomHover, onRoomClick }, ref) {
  const mountRef = useRef(null);

  useImperativeHandle(ref, () => ({}), []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const totalHeight = FLOOR_GAP * (FLOORS.length - 1) + WALL_HEIGHT;
    // ~25-30° elevation — an architectural 3/4 axonometric, low enough to
    // read the wall faces as walls, high enough to still see every floor's
    // roof plan and room etching.
    camera.position.set(13, totalHeight * 0.5 + 8.5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    mount.appendChild(renderer.domElement);

    const target = new THREE.Vector3(0, totalHeight / 2 - 0.6, 0);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 9;
    controls.maxDistance = 26;
    controls.minPolarAngle = Math.PI * 0.32;
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    camera.lookAt(target);

    let idleTimer = null;
    const wake = () => {
      controls.autoRotate = false;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        controls.autoRotate = true;
      }, 3200);
    };
    controls.addEventListener("start", wake);

    const roomMeshes = []; // { mesh, line, room }
    const cornerPoints = []; // per-floor envelope TOP corners, for vertical connectors

    const envSize = rectSize(ENVELOPE);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x18140f,
      transparent: true,
      opacity: 0.62,
      roughness: 0.9,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x141311, roughness: 0.85, side: THREE.DoubleSide });

    FLOORS.forEach((floor, floorIndex) => {
      const y = floorIndex * FLOOR_GAP;
      const group = new THREE.Group();
      group.position.y = y;

      // The floor's real volume — a low, solid-walled box, not a flat plane.
      // Edges are drawn separately in gold for the crisp line-art read.
      const boxGeo = new THREE.BoxGeometry(envSize.w, WALL_HEIGHT, envSize.d);
      const box = new THREE.Mesh(boxGeo, wallMat);
      box.position.set(envSize.cx, WALL_HEIGHT / 2, envSize.cz);
      group.add(box);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeo),
        new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.65 })
      );
      edges.position.copy(box.position);
      group.add(edges);

      cornerPoints.push(rectCorners(ENVELOPE).map(([x, z]) => new THREE.Vector3(x, y + WALL_HEIGHT, z)));

      // Interior partitions etched onto the roof/top face — the "floor plan"
      // read, drawn on top of real massing instead of instead of it.
      floor.rooms.forEach((room) => {
        const line = makeLineLoop(room.plan, WALL_HEIGHT + 0.01, IVORY, 0.6);
        group.add(line);

        const size = rectSize(room.plan);
        const hitGeo = new THREE.PlaneGeometry(size.w, size.d);
        const hitMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, side: THREE.DoubleSide });
        const hit = new THREE.Mesh(hitGeo, hitMat);
        hit.rotation.x = -Math.PI / 2;
        hit.position.set(size.cx, WALL_HEIGHT + 0.03, size.cz);
        group.add(hit);

        roomMeshes.push({ mesh: hit, line, room });
      });

      // A shallow hipped roof on the top floor only — the one detail that
      // reads as "house" rather than "server rack."
      if (floorIndex === FLOORS.length - 1) {
        const roofGeo = new THREE.ConeGeometry(1, 0.75, 4, 1);
        // rotateY FIRST to align the 4-gon's flat faces with X/Z (a raw
        // radialSegments=4 cone has its corners on the axes, not its faces),
        // then scale — scaling before rotating would skew it into a rhombus.
        roofGeo.rotateY(Math.PI / 4);
        roofGeo.scale((envSize.w / Math.SQRT2) * 1.02, 1, (envSize.d / Math.SQRT2) * 1.02);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(envSize.cx, WALL_HEIGHT + 0.375, envSize.cz);
        group.add(roof);
        const roofEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(roofGeo),
          new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.5 })
        );
        roofEdges.position.copy(roof.position);
        group.add(roofEdges);
      }

      scene.add(group);
    });

    // Dashed vertical connectors at each envelope corner, floor to floor —
    // the convention that makes an exploded axonometric read as one building.
    for (let f = 0; f < cornerPoints.length - 1; f++) {
      for (let c = 0; c < 4; c++) {
        const a = cornerPoints[f][c];
        const b = cornerPoints[f + 1][c];
        const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
        const mat = new THREE.LineDashedMaterial({ color: GOLD, transparent: true, opacity: 0.28, dashSize: 0.12, gapSize: 0.1 });
        const line = new THREE.Line(geo, mat);
        line.computeLineDistances();
        scene.add(line);
      }
    }

    const ambient = new THREE.AmbientLight(0xfff1dc, 0.7);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffe8c8, 0.9);
    key.position.set(8, 14, 6);
    scene.add(key);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered = null;

    const setHover = (entry) => {
      if (hovered === entry) return;
      if (hovered) hovered.line.material.color.setHex(IVORY);
      hovered = entry;
      if (hovered) hovered.line.material.color.setHex(GOLD);
      onRoomHover?.(entry ? entry.room : null);
    };

    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(roomMeshes.map((r) => r.mesh));
      if (hits.length) {
        const entry = roomMeshes.find((r) => r.mesh === hits[0].object);
        setHover(entry);
        mount.style.cursor = "pointer";
      } else {
        setHover(null);
        mount.style.cursor = "";
      }
    };

    const onClick = () => {
      if (hovered) onRoomClick?.(hovered.room);
    };

    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("click", onClick);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.removeEventListener("start", wake);
      if (idleTimer) clearTimeout(idleTimer);
      controls.dispose();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("click", onClick);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onRoomHover, onRoomClick]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
});

export default VillaScene;
