'use client';
/* eslint-disable */
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FLOORS, ROOM_SPACING } from './galleryData';

// Modular imports
import { getSurfBundle, disposeSurfBundleCache, disposeArtTextureCache } from './lib/textures';
import { disposeShadowCache } from './lib/shadows';
import { buildRoom, disposeGLTFCache } from './lib/buildRoom';

import { findPiece } from './lib/interactive';
import { moodForRoom, applyMood } from './lib/lightMoods';

const GalleryScene = forwardRef(function GalleryScene({ onRoomChange, onFloorChange, onPieceHover, onReady }, ref) {
  const mountRef = useRef(null);
  const internals = useRef(null);

  useImperativeHandle(ref, () => ({
    goToRoom(index) {
      const s = internals.current;
      if (!s) return;
      const max = FLOORS[s.currentFloor].rooms.length - 1;
      s.beginRoom?.(Math.max(0, Math.min(max, index)));
    },
    nextRoom() {
      const s = internals.current;
      if (!s) return;
      if (s.currentRoom < FLOORS[s.currentFloor].rooms.length - 1) s.beginRoom?.(s.currentRoom + 1);
    },
    prevRoom() {
      const s = internals.current;
      if (!s) return;
      if (s.currentRoom > 0) s.beginRoom?.(s.currentRoom - 1);
    },
    setFloor(floorIndex) {
      const s = internals.current;
      if (!s) return;
      s.beginFloor?.(Math.max(0, Math.min(FLOORS.length - 1, floorIndex)));
    },
    get currentRoom() { return internals.current?.currentRoom ?? 0; },
    get currentFloor() { return internals.current?.currentFloor ?? 1; },
    get roomCount() { return FLOORS[internals.current?.currentFloor ?? 1].rooms.length; },
    get floorCount() { return FLOORS.length; },
    getFloorData() { return FLOORS; },
    getRoomNames() { return FLOORS[internals.current?.currentFloor ?? 1].rooms.map(r => r.name); },
  }));

  // Shared Materials with Interior Designer Depth & Textures
  const sharedMats = useRef(null);
  function getSharedMats() {
    if (!sharedMats.current) {
      const woodB = getSurfBundle('wood', 0x3a2b1f, 1.5, 1.5);
      const walnutB = getSurfBundle('wood', 0x5c3d28, 1.5, 1.5);
      const marbCalB = getSurfBundle('marble', 0xd6c8b4, 1, 1);
      const marbNeroB = getSurfBundle('marble', 0x221d18, 1, 1);
      const boucB = getSurfBundle('boucle', 0xf2ede4, 2, 2);
      const fabricB = getSurfBundle('boucle', 0xb8aba0, 2, 2);
      const leatherB = getSurfBundle('leather', 0x8a4b28, 2, 2);
      const velvetTerraB = getSurfBundle('velvet', 0xb85d43, 2, 2);
      const velvetForB = getSurfBundle('velvet', 0x2e3d30, 2, 2);
      const velvetNavyB = getSurfBundle('velvet', 0x1e2a3a, 2, 2);
      const velvetCaramelB = getSurfBundle('velvet', 0x986a3b, 2, 2);
      const linenB = getSurfBundle('linen', 0xe8ddd0, 3, 3);

      sharedMats.current = {
        ceiling: new THREE.MeshStandardMaterial({ color: 0xf5efe6, roughness: 0.78 }),
        glow: new THREE.MeshBasicMaterial({ color: 0xfffaee, transparent: true, opacity: 0.88 }),
        glowDim: new THREE.MeshBasicMaterial({ color: 0xfff8e8, transparent: true, opacity: 0.45 }),
        fixtureGlow: new THREE.MeshBasicMaterial({ color: 0xfffaee }),
        darkWood: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: woodB.map, normalMap: woodB.normalMap, roughnessMap: woodB.roughnessMap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 1.0, metalness: 0.02, clearcoat: 0.45, clearcoatRoughness: 0.18 }),
        walnutWood: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: walnutB.map, normalMap: walnutB.normalMap, roughnessMap: walnutB.roughnessMap, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 1.0, metalness: 0.02, clearcoat: 0.5, clearcoatRoughness: 0.2 }),
        marble: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: marbCalB.map, normalMap: marbCalB.normalMap, roughnessMap: marbCalB.roughnessMap, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0, metalness: 0.08, envMapIntensity: 2.0, clearcoat: 0.9, clearcoatRoughness: 0.06 }),
        marbleNero: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: marbNeroB.map, normalMap: marbNeroB.normalMap, roughnessMap: marbNeroB.roughnessMap, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0, metalness: 0.12, envMapIntensity: 1.8, clearcoat: 0.9, clearcoatRoughness: 0.06 }),
        boucle: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: boucB.map, normalMap: boucB.normalMap, roughnessMap: boucB.roughnessMap, normalScale: new THREE.Vector2(1.2, 1.2), roughness: 1.0, sheen: 0.6, sheenRoughness: 0.85, sheenColor: new THREE.Color(0xfff4e6) }),
        fabricDark: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: fabricB.map, normalMap: fabricB.normalMap, roughnessMap: fabricB.roughnessMap, normalScale: new THREE.Vector2(1.0, 1.0), roughness: 1.0, sheen: 0.5, sheenRoughness: 0.85, sheenColor: new THREE.Color(0xe8dccb) }),
        velvetTerracotta: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: velvetTerraB.map, normalMap: velvetTerraB.normalMap, roughnessMap: velvetTerraB.roughnessMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 1.0, sheen: 1.0, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xe6a683) }),
        velvetForest: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: velvetForB.map, normalMap: velvetForB.normalMap, roughnessMap: velvetForB.roughnessMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 1.0, sheen: 1.0, sheenRoughness: 0.4, sheenColor: new THREE.Color(0x8fae8c) }),
        velvetNavy: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: velvetNavyB.map, normalMap: velvetNavyB.normalMap, roughnessMap: velvetNavyB.roughnessMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 1.0, sheen: 1.0, sheenRoughness: 0.4, sheenColor: new THREE.Color(0x8093b8) }),
        velvetCaramel: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: velvetCaramelB.map, normalMap: velvetCaramelB.normalMap, roughnessMap: velvetCaramelB.roughnessMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 1.0, sheen: 1.0, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xd8a86a) }),
        leatherCognac: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: leatherB.map, normalMap: leatherB.normalMap, roughnessMap: leatherB.roughnessMap, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 1.0, metalness: 0.04, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
        linen: new THREE.MeshStandardMaterial({ color: 0xffffff, map: linenB.map, normalMap: linenB.normalMap, roughnessMap: linenB.roughnessMap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 1.0 }),
        metal: new THREE.MeshStandardMaterial({ color: 0xc4a24f, roughness: 0.28, metalness: 0.82, envMapIntensity: 1.45 }),
        metalDark: new THREE.MeshStandardMaterial({ color: 0x4a3e2e, roughness: 0.36, metalness: 0.72 }),
        glass: new THREE.MeshPhysicalMaterial({ color: 0xd8e5e7, roughness: 0.02, metalness: 0.0, transparent: true, opacity: 0.34, transmission: 0.72, thickness: 0.18, envMapIntensity: 1.35 }),
        rugMat: new THREE.MeshStandardMaterial({ color: 0xffffff, map: linenB.map, normalMap: linenB.normalMap, roughnessMap: linenB.roughnessMap, normalScale: new THREE.Vector2(0.6, 0.6), roughness: 1.0, transparent: true, opacity: 0.55 }),
        pebble: new THREE.MeshStandardMaterial({ color: 0xbdb2a0, roughness: 0.92, metalness: 0.02 }),
        ceramicPot: new THREE.MeshStandardMaterial({ color: 0xc86a4b, roughness: 0.86, metalness: 0.03 }),
        foliage: new THREE.MeshStandardMaterial({ color: 0x4a5a3a, roughness: 0.85 }),
      };
    }
    return sharedMats.current;
  }

  function rebuildRooms(s) {
    while (s.roomsGroup.children.length) {
      const child = s.roomsGroup.children[0];
      child.traverse((obj) => {
        if (obj.geometry && !obj.userData.isModel) obj.geometry.dispose();
      });
      s.roomsGroup.remove(child);
    }
    const floor = FLOORS[s.currentFloor];
    floor.rooms.forEach((roomDef, i) => {
      const room = buildRoom(roomDef, i, s.currentFloor, getSharedMats());
      const pos = roomDef.pos || { x: i * ROOM_SPACING, y: 0, z: 0, ry: 0 };
      room.position.set(pos.x, pos.y, pos.z);
      room.rotation.y = pos.ry;
      s.roomsGroup.add(room);
    });
  }

  function getRoomCamAnchor(floorIndex, roomIndex) {
    const roomDef = FLOORS[floorIndex].rooms[roomIndex];
    const pos = roomDef.pos || { x: roomIndex * ROOM_SPACING, y: 0, z: 0, ry: 0 };
    const cam = roomDef.cam || { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.3, tz: -1.5 };
    const cos = Math.cos(pos.ry), sin = Math.sin(pos.ry);

    const Wpx = pos.x + (cam.px * cos - cam.pz * sin);
    const Wpy = pos.y + cam.py;
    const Wpz = pos.z + (cam.px * sin + cam.pz * cos);

    const Wtx = pos.x + (cam.tx * cos - cam.tz * sin);
    const Wty = pos.y + cam.ty;
    const Wtz = pos.z + (cam.tx * sin + cam.tz * cos);

    return { p: [Wpx, Wpy, Wpz], t: [Wtx, Wty, Wtz] };
  }

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const onContextLost = (e) => { e.preventDefault(); };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    // Evening re-grade: initial background/fog match the Grand Foyer mood
    // (the room the scene opens in) instead of the old daylight cream —
    // applyMood() takes over every frame after mount and lerps both toward
    // whichever room is active.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x231f18);
    scene.fog = new THREE.FogExp2(0x231f18, 0.012);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.32;

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 140);
    const initialCam = getRoomCamAnchor(1, 0);
    camera.position.set(...initialCam.p);

    const ambient = new THREE.AmbientLight(0xfff1dc, 0.025);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xfff6e6, 0x8f8172, 0.17);
    scene.add(hemi);

    const dirKey = new THREE.DirectionalLight(0xffead0, 3.25);
    dirKey.position.set(5, 8.5, 4.2);
    dirKey.castShadow = true;
    dirKey.shadow.mapSize.set(4096, 4096);
    dirKey.shadow.camera.near = 1;
    dirKey.shadow.camera.far = 28;
    dirKey.shadow.camera.left = -10;
    dirKey.shadow.camera.right = 10;
    dirKey.shadow.camera.top = 10;
    dirKey.shadow.camera.bottom = -7;
    dirKey.shadow.bias = -0.00025;
    dirKey.shadow.normalBias = 0.035;
    dirKey.shadow.radius = 1.8;
    scene.add(dirKey);
    scene.add(dirKey.target);

    const dirRim = new THREE.DirectionalLight(0xffd9a8, 0.36);
    dirRim.position.set(-3, 5, -4);
    scene.add(dirRim);
    scene.add(dirRim.target);

    const dirFill = new THREE.DirectionalLight(0xdce6ef, 0.11);
    dirFill.position.set(-4, 4, 3);
    scene.add(dirFill);

    const spotOffsets = [-3.6, -1.2, 1.2, 3.6];
    const spots = spotOffsets.map((ox) => {
      const sp = new THREE.SpotLight(0xffeed4, 34, 13, Math.PI * 0.18, 0.72, 1.45);
      sp.position.set(ox, 4.3, -3.2);
      sp.target.position.set(ox, 1.1, -5.2);
      scene.add(sp);
      scene.add(sp.target);
      return sp;
    });

    // Rig handle so the per-room light moods can retune everything each frame.
    const lightRig = { ambient, hemi, dirKey, dirRim, dirFill, spots, scene, renderer };

    const roomsGroup = new THREE.Group();
    scene.add(roomsGroup);

    const s = {
      currentRoom: 0,
      currentFloor: 1,
      camP: [...initialCam.p],
      camT: [...initialCam.t],
      pointerX: 0, pointerY: 0, ptrTx: 0, ptrTy: 0,
      isDragging: false, dragStartX: 0, dragDelta: 0,
      roomsGroup,
      transit: null,
    };
    internals.current = s;

    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    s.beginRoom = (index) => {
      if (index === s.currentRoom && !s.transit) return;
      const fromAnchor = { p: [...s.camP], t: [...s.camT] };
      const toAnchor = getRoomCamAnchor(s.currentFloor, index);
      s.currentRoom = index;
      s.transit = { fromAnchor, toAnchor, dur: 1.1, t: 0 };
      onRoomChange?.(index);
    };

    s.beginFloor = (floorIndex) => {
      if (floorIndex === s.currentFloor && !s.transit) return;
      const fromAnchor = { p: [...s.camP], t: [...s.camT] };
      const toAnchor = getRoomCamAnchor(floorIndex, 0);
      s.transit = { fromAnchor, toAnchor, dur: 1.5, t: 0, rebuildFloor: floorIndex };
    };

    rebuildRooms(s);
    onFloorChange?.(s.currentFloor);
    onRoomChange?.(0);

    // Furniture hover: raycast against the active room and surface the piece's
    // name / materials / description. Throttled so we don't test every pixel.
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let lastPick = 0;
    let hoveredPiece = null;

    const pickPiece = (clientX, clientY) => {
      const rect = mount.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(s.roomsGroup.children, true);
      for (const hit of hits) {
        const piece = findPiece(hit.object);
        if (piece) return piece;
      }
      return null;
    };

    const onPointerMove = (e) => {
      s.ptrTx = (e.clientX / window.innerWidth) * 2 - 1;
      s.ptrTy = (e.clientY / window.innerHeight) * 2 - 1;

      const now = performance.now();
      if (now - lastPick < 90 || s.transit) return;
      lastPick = now;

      const piece = pickPiece(e.clientX, e.clientY);
      if (piece !== hoveredPiece) {
        hoveredPiece = piece;
        mount.style.cursor = piece ? 'pointer' : 'grab';
        onPieceHover?.(piece ? piece.userData.pieceInfo : null);
      }
    };
    const onPointerDown = (e) => {
      s.isDragging = true;
      s.dragStartX = e.clientX;
    };
    const onPointerUp = (e) => {
      if (s.isDragging && !s.transit) {
        const dx = e.clientX - s.dragStartX;
        const max = FLOORS[s.currentFloor].rooms.length - 1;
        if (Math.abs(dx) > 44) {
          if (dx < 0 && s.currentRoom < max) s.beginRoom(s.currentRoom + 1);
          if (dx > 0 && s.currentRoom > 0) s.beginRoom(s.currentRoom - 1);
        }
      }
      s.isDragging = false;
    };
    let wheelCooldown = 0;
    const onWheel = (e) => {
      const now = performance.now();
      if (s.transit || now - wheelCooldown < 550) return;
      const max = FLOORS[s.currentFloor].rooms.length - 1;
      // Rooms are a left-to-right journey. Preserve normal page scrolling and
      // only capture a horizontal trackpad/wheel gesture (or Shift + wheel).
      const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY)
        ? e.deltaX
        : (e.shiftKey ? e.deltaY : 0);
      const forward = horizontalDelta > 12;
      const backward = horizontalDelta < -12;

      if (forward && s.currentRoom < max) {
        e.preventDefault();
        wheelCooldown = now;
        s.beginRoom(s.currentRoom + 1);
      } else if (backward && s.currentRoom > 0) {
        e.preventDefault();
        wheelCooldown = now;
        s.beginRoom(s.currentRoom - 1);
      }
    };

    let touchStartX = 0, touchStartY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = (e) => {
      if (!e.changedTouches.length || s.transit) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const max = FLOORS[s.currentFloor].rooms.length - 1;

      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0 && s.currentRoom < max) {
          s.beginRoom(s.currentRoom + 1);
        } else if (dx > 0 && s.currentRoom > 0) {
          s.beginRoom(s.currentRoom - 1);
        }
      }
    };

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      if (w / h < 1.0) {
        camera.fov = 48 + (1.0 - w / h) * 18;
      } else {
        camera.fov = 42;
      }
      camera.updateProjectionMatrix();
    };
    onResize();

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('touchstart', onTouchStart, { passive: true });
    mount.addEventListener('touchend', onTouchEnd, { passive: true });
    mount.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    let raf = 0;
    let idleTimer = 0;
    let isVisible = true;
    const viewportObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.01 });
    viewportObserver.observe(mount);
    let lastT = performance.now();

    const tick = () => {
      // A WebGL scene has no reason to keep drawing while another section (or
      // browser tab) is visible. Poll lightly so it wakes without a costly
      // continuous render loop when the visitor comes back.
      if (!isVisible || document.hidden) {
        idleTimer = window.setTimeout(tick, 250);
        return;
      }
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      s.pointerX += (s.ptrTx - s.pointerX) * 0.04;
      s.pointerY += (s.ptrTy - s.pointerY) * 0.04;
      s.time = (s.time || 0) + dt;

      if (s.transit) {
        const tr = s.transit;
        tr.t = Math.min(tr.t + dt / tr.dur, 1);
        const e = easeInOut(tr.t);

        for (let k = 0; k < 3; k++) {
          s.camP[k] = tr.fromAnchor.p[k] + (tr.toAnchor.p[k] - tr.fromAnchor.p[k]) * e;
          s.camT[k] = tr.fromAnchor.t[k] + (tr.toAnchor.t[k] - tr.fromAnchor.t[k]) * e;
        }

        if (tr.rebuildFloor != null && tr.t >= 0.5) {
          s.currentFloor = tr.rebuildFloor;
          s.currentRoom = 0;
          tr.rebuildFloor = null;
          rebuildRooms(s);
          onFloorChange?.(s.currentFloor);
          onRoomChange?.(0);
        }
        if (tr.t >= 1) s.transit = null;
      }

      const idleX = Math.sin(s.time * 0.11) * 0.055;
      const idleY = Math.sin(s.time * 0.085 + 1.7) * 0.025;
      const idleZ = Math.cos(s.time * 0.075) * 0.04;

      camera.position.x = s.camP[0] + s.pointerX * 0.14 + idleX;
      camera.position.y = s.camP[1] + s.pointerY * -0.045 + idleY;
      camera.position.z = s.camP[2] + idleZ;

      const activeRoomDef = FLOORS[s.currentFloor]?.rooms[s.currentRoom];
      const rPos = activeRoomDef?.pos || { x: 0, y: 0, z: 0, ry: 0 };

      // Cross-fade the rig toward the active room's mood so each space has its
      // own light — candle-lit cellar, cool spa, golden living room.
      applyMood(lightRig, moodForRoom(activeRoomDef?.name), Math.min(1, dt * 2.2));
      const cosR = Math.cos(rPos.ry), sinR = Math.sin(rPos.ry);

      dirKey.position.set(rPos.x + 4 * cosR + 5 * sinR, 9, rPos.z - 4 * sinR + 5 * cosR);
      dirKey.target.position.set(rPos.x, 1, rPos.z);
      dirRim.position.set(rPos.x - 3 * cosR - 4 * sinR, 5, rPos.z + 3 * sinR - 4 * cosR);
      dirRim.target.position.set(rPos.x, 1.4, rPos.z);
      dirFill.position.set(rPos.x - 4 * cosR + 3 * sinR, 4, rPos.z + 4 * sinR + 3 * cosR);

      for (let i = 0; i < spots.length; i++) {
        const ox = spotOffsets[i];
        spots[i].position.set(rPos.x + ox * cosR + 3.2 * sinR, 4.3, rPos.z + ox * sinR - 3.2 * cosR);
        spots[i].target.position.set(rPos.x + ox * cosR + 5.2 * sinR, 1.1, rPos.z + ox * sinR - 5.2 * cosR);
      }

      camera.lookAt(s.camT[0] + s.pointerX * 0.1, s.camT[1], s.camT[2]);
      renderer.render(scene, camera);
      if (!s.announcedReady) {
        s.announcedReady = true;
        onReady?.();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      viewportObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('touchstart', onTouchStart);
      mount.removeEventListener('touchend', onTouchEnd);
      mount.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      const mats = sharedMats.current;
      if (mats) Object.values(mats).forEach(m => m.dispose());
      disposeArtTextureCache();
      disposeSurfBundleCache();
      disposeGLTFCache();
      disposeShadowCache();
      envRT.dispose();
      pmrem.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onRoomChange, onFloorChange, onPieceHover, onReady]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        height: '100%',
        width: '100%',
        cursor: 'grab',
        touchAction: 'none',
      }}
    />
  );
});

GalleryScene.displayName = 'GalleryScene';
export default GalleryScene;
