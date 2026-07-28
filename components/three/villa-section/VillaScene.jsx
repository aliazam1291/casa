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
const FLOOR_GAP = 3.4; // "drawn apart" — exaggerated beyond a real storey height

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

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const totalHeight = FLOOR_GAP * (FLOORS.length - 1);
    camera.position.set(11, totalHeight * 0.62 + 3.5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    mount.appendChild(renderer.domElement);

    const target = new THREE.Vector3(0, totalHeight / 2, 0);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 22;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.48;
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

    const GOLD = 0xa78657;
    const IVORY = 0xe8e1d3;

    const roomMeshes = []; // { mesh, line, room }
    const cornerPoints = []; // per-floor envelope corners for vertical connectors

    FLOORS.forEach((floor, floorIndex) => {
      const y = floorIndex * FLOOR_GAP;
      const group = new THREE.Group();
      group.position.y = y;

      // Building envelope for this floor
      const envelope = makeLineLoop(ENVELOPE, 0, GOLD, 0.55);
      group.add(envelope);
      cornerPoints.push(rectCorners(ENVELOPE).map(([x, z]) => new THREE.Vector3(x, y, z)));

      // A faint filled slab so each floor still reads as a plane, not just wires
      const [ex0, ez0] = toWorld(ENVELOPE.x, ENVELOPE.y);
      const [ex1, ez1] = toWorld(ENVELOPE.x + ENVELOPE.w, ENVELOPE.y + ENVELOPE.h);
      const slabGeo = new THREE.PlaneGeometry(ex1 - ex0, ez1 - ez0);
      const slabMat = new THREE.MeshBasicMaterial({ color: 0x141311, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.rotation.x = -Math.PI / 2;
      slab.position.set((ex0 + ex1) / 2, -0.01, (ez0 + ez1) / 2);
      group.add(slab);

      floor.rooms.forEach((room) => {
        const line = makeLineLoop(room.plan, 0.01, IVORY, 0.55);
        group.add(line);

        const [rx0, rz0] = toWorld(room.plan.x, room.plan.y);
        const [rx1, rz1] = toWorld(room.plan.x + room.plan.w, room.plan.y + room.plan.h);
        const hitGeo = new THREE.PlaneGeometry(rx1 - rx0, rz1 - rz0);
        const hitMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, side: THREE.DoubleSide });
        const hit = new THREE.Mesh(hitGeo, hitMat);
        hit.rotation.x = -Math.PI / 2;
        hit.position.set((rx0 + rx1) / 2, 0.02, (rz0 + rz1) / 2);
        group.add(hit);

        roomMeshes.push({ mesh: hit, line, room });
      });

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

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

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
