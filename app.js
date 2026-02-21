import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  const plansGrid = document.getElementById("plansGrid");
  const roofCanvas = document.getElementById("roofCanvas");
  const scaleSelect = document.getElementById("scaleSelect");
  const downloadAllBtn = document.getElementById("downloadAllBtn");

  let currentScale = 1;

  const floors = [
    { id: "floor1", name: "Floor 1", topLabel: false },
    { id: "floor2", name: "Floor 2", topLabel: false },
    { id: "floor3", name: "Floor 3", topLabel: false },
    { id: "floor4", name: "Floor 4 (Top)", topLabel: true }
  ];

  // Build floor cards
  floors.forEach(f => {
    const card = document.createElement("div");
    card.className = "planCard";
    card.innerHTML = `
      <div class="planTop">
        <div>
          <div class="planTitle">${f.name}</div>
          <div class="planMeta">Balcony • Big Parlour + Guest Toilet • 3 Bedrooms (each with toilet)</div>
        </div>
        <button class="btnSecondary" data-download="${f.id}">Download SVG</button>
      </div>
      <div class="planCanvas" id="${f.id}"></div>
    `;
    plansGrid?.appendChild(card);

    const canvas = card.querySelector(`#${f.id}`);
    const svg = buildFloorSVG({ topLabel: f.topLabel });
    canvas.appendChild(svg);
  });

  // Roof plan
  roofCanvas?.appendChild(buildRoofSVG());

  // Zoom plans
  scaleSelect?.addEventListener("change", () => {
    currentScale = Number(scaleSelect.value);
    document.querySelectorAll("svg[data-scalable='true']").forEach(svg => {
      svg.style.transform = `scale(${currentScale})`;
    });
  });

  // Download single plan
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-download]");
    if (!btn) return;
    const id = btn.getAttribute("data-download");

    if (id === "roof") {
      downloadSVG(roofCanvas?.querySelector("svg"), "Louis_Villa_Roof.svg");
      return;
    }

    const floorEl = document.getElementById(id);
    const svg = floorEl?.querySelector("svg");
    downloadSVG(svg, `Louis_Villa_${id}.svg`);
  });

  // Download all plans
  downloadAllBtn?.addEventListener("click", () => {
    floors.forEach(f => {
      const svg = document.getElementById(f.id)?.querySelector("svg");
      downloadSVG(svg, `Louis_Villa_${f.id}.svg`);
    });
    downloadSVG(roofCanvas?.querySelector("svg"), "Louis_Villa_Roof.svg");
  });

  // Apply initial zoom
  document.querySelectorAll("svg[data-scalable='true']").forEach(svg => {
    svg.style.transform = `scale(${currentScale})`;
  });

  // 3D viewer
  init3DViewer();

  // ---------- SVG Builders ----------
  function buildFloorSVG({ topLabel }) {
    const svg = svgEl("svg");
    svg.setAttribute("width", "980");
    svg.setAttribute("height", "680");
    svg.setAttribute("viewBox", "0 0 980 680");
    svg.dataset.scalable = "true";
    svg.style.transformOrigin = "top left";

    if (topLabel) {
      svg.appendChild(rect(120, 18, 740, 64, "#2e4cff", "white", 2, 10));
      svg.appendChild(text("LOUIS VILLA", 490, 62, 34, true));
    }

    // Outer wall
    svg.appendChild(rect(70, 120, 840, 520, "none", "white", 4, 12));

    // Balcony (every floor)
    svg.appendChild(rect(170, 80, 640, 70, "#2a2f45", "white", 2, 10));
    svg.appendChild(text("Balcony", 490, 125, 16, true));

    // Big Parlour
    svg.appendChild(rect(105, 185, 420, 270, "#203a7a", "white", 2, 10));
    svg.appendChild(text("Big Parlour", 315, 325, 18, true));

    // Guest toilet
    svg.appendChild(rect(545, 185, 160, 130, "#6a2f63", "white", 2, 10));
    svg.appendChild(text("Guest Toilet", 625, 260, 12, true));

    // Bedroom 3 + Toilet (upper-right)
    svg.appendChild(rect(720, 185, 170, 130, "#1a5b4a", "white", 2, 10));
    svg.appendChild(text("Bedroom 3", 805, 255, 12, true));
    svg.appendChild(rect(720, 320, 170, 95, "#6a2f63", "white", 2, 10));
    svg.appendChild(text("Toilet", 805, 378, 12, true));

    // Bedroom 1 + Toilet (bottom-left)
    svg.appendChild(rect(105, 470, 270, 160, "#1a5b4a", "white", 2, 10));
    svg.appendChild(text("Bedroom 1", 240, 560, 14, true));
    svg.appendChild(rect(380, 470, 145, 110, "#6a2f63", "white", 2, 10));
    svg.appendChild(text("Toilet", 452, 535, 12, true));

    // Bedroom 2 + Toilet (bottom-right)
    svg.appendChild(rect(545, 470, 270, 160, "#1a5b4a", "white", 2, 10));
    svg.appendChild(text("Bedroom 2", 680, 560, 14, true));
    svg.appendChild(rect(820, 470, 90, 110, "#6a2f63", "white", 2, 10));
    svg.appendChild(text("Toilet", 865, 535, 11, true));

    // Corridor hint
    svg.appendChild(rect(545, 330, 170, 110, "#2a2f45", "white", 2, 10));
    svg.appendChild(text("Corridor", 630, 392, 12, true));

    return svg;
  }

  function buildRoofSVG() {
    const svg = svgEl("svg");
    svg.setAttribute("width", "980");
    svg.setAttribute("height", "540");
    svg.setAttribute("viewBox", "0 0 980 540");
    svg.dataset.scalable = "true";
    svg.style.transformOrigin = "top left";

    svg.appendChild(rect(70, 70, 840, 400, "none", "white", 4, 14));
    svg.appendChild(text("ROOF PLAN", 490, 110, 20, true));

    svg.appendChild(rect(120, 140, 740, 260, "#1c2a55", "white", 2, 14));
    svg.appendChild(text("Open Roof / Terrace Area", 490, 280, 16, true));

    svg.appendChild(rect(220, 420, 540, 60, "#2e4cff", "white", 2, 14));
    svg.appendChild(text("LOUIS VILLA", 490, 460, 28, true));

    return svg;
  }

  // ---------- Helpers ----------
  function downloadSVG(svg, filename) {
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function svgEl(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  function rect(x, y, w, h, fill, stroke, strokeWidth, rx=0) {
    const r = svgEl("rect");
    r.setAttribute("x", x);
    r.setAttribute("y", y);
    r.setAttribute("width", w);
    r.setAttribute("height", h);
    r.setAttribute("fill", fill);
    r.setAttribute("stroke", stroke);
    r.setAttribute("stroke-width", strokeWidth);
    r.setAttribute("rx", rx);
    return r;
  }

  function text(content, x, y, size, bold) {
    const t = svgEl("text");
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("fill", "white");
    t.setAttribute("font-size", String(size));
    t.setAttribute("font-weight", bold ? "800" : "400");
    t.textContent = content;
    return t;
  }

  // ---------- 3D Viewer ----------
  // Minimal orbit controls (no external OrbitControls dependency).
  // Left-drag: rotate • Wheel: zoom • Right-drag / Shift+drag: pan
  function createBasicOrbitControls(camera, domEl, opts = {}) {
    const target = opts.target ? opts.target.clone() : new THREE.Vector3();
    let radius = (opts.radius ?? 320);
    const minRadius = opts.minRadius ?? 80;
    const maxRadius = opts.maxRadius ?? 1500;
    const damping = opts.damping ?? 0.12;

    const offset = new THREE.Vector3().subVectors(camera.position, target);
    const spherical = new THREE.Spherical().setFromVector3(offset);

    let isRotating = false;
    let isPanning = false;
    let lastX = 0;
    let lastY = 0;

    let velTheta = 0;
    let velPhi = 0;
    let velPanX = 0;
    let velPanY = 0;
    let velRadius = 0;

    domEl.style.touchAction = "none";

    function clampPhi() {
      const EPS = 0.0001;
      spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, spherical.phi));
    }

    function pan(dx, dy) {
      const panSpeed = radius / 500;
      const v = new THREE.Vector3();
      const right = new THREE.Vector3();
      const up = new THREE.Vector3();

      camera.getWorldDirection(v);
      right.crossVectors(v, camera.up).normalize();
      up.copy(camera.up).normalize();

      target.addScaledVector(right, -dx * panSpeed);
      target.addScaledVector(up, dy * panSpeed);
    }

    function onPointerDown(e) {
      domEl.setPointerCapture?.(e.pointerId);
      lastX = e.clientX;
      lastY = e.clientY;
      const panMode = (e.button === 2) || e.shiftKey;
      isPanning = panMode;
      isRotating = !panMode;
    }

    function onPointerMove(e) {
      if (!isRotating && !isPanning) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (isRotating) {
        velTheta += -dx * 0.006;
        velPhi += -dy * 0.006;
      } else {
        velPanX += dx * 0.004;
        velPanY += dy * 0.004;
      }
    }

    function onPointerUp(e) {
      isRotating = false;
      isPanning = false;
      domEl.releasePointerCapture?.(e.pointerId);
    }

    function onWheel(e) {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      velRadius += delta * 18;
    }

    function onContextMenu(e) { e.preventDefault(); }

    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("wheel", onWheel, { passive: false });
    domEl.addEventListener("contextmenu", onContextMenu);

    function update() {
      velTheta *= (1 - damping);
      velPhi *= (1 - damping);
      velPanX *= (1 - damping);
      velPanY *= (1 - damping);
      velRadius *= (1 - damping);

      spherical.theta += velTheta;
      spherical.phi += velPhi;
      clampPhi();

      radius = Math.min(maxRadius, Math.max(minRadius, radius + velRadius));
      spherical.radius = radius;

      if (Math.abs(velPanX) > 1e-5 || Math.abs(velPanY) > 1e-5) {
        pan(velPanX, velPanY);
      }

      const newOffset = new THREE.Vector3().setFromSpherical(spherical);
      camera.position.copy(target).add(newOffset);
      camera.lookAt(target);
    }

    function reset(camPos = new THREE.Vector3(220, 190, 220), newTarget = new THREE.Vector3(0, 18, 0)) {
      target.copy(newTarget);
      camera.position.copy(camPos);
      const off = new THREE.Vector3().subVectors(camera.position, target);
      spherical.setFromVector3(off);
      radius = spherical.radius;
      velTheta = velPhi = velPanX = velPanY = velRadius = 0;
    }

    return { target, update, reset, get radius() { return radius; }, set radius(v) { radius = v; } };
  }

  function init3DViewer() {
    const container = document.getElementById("threeContainer");
    const hint = document.getElementById("threeHint");

    const modeSelect = document.getElementById("modeSelect");
    const viewSelect = document.getElementById("viewSelect");
    const explodeRange = document.getElementById("explodeRange");
    const resetBtn = document.getElementById("resetCamBtn");
    const fitRoomBtn = document.getElementById("fitRoomBtn");
    const wallsToggle = document.getElementById("wallsToggle");
    const ceilingToggle = document.getElementById("ceilingToggle");
    const labelsToggle = document.getElementById("labelsToggle");

    if (!container) return;

    // Three.js is an ES module. If it failed, show a helpful message.
    if (!THREE) {
      if (hint) hint.textContent = "3D library failed to load. Check your internet/CDN access.";
      return;
    }

    container.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e162f);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
    camera.position.set(220, 190, 220);

    const controls = createBasicOrbitControls(camera, renderer.domElement, {
      target: new THREE.Vector3(0, 18, 0),
      minRadius: 120,
      maxRadius: 900,
      damping: 0.10,
    });

    // Lights
    scene.add(new THREE.HemisphereLight(0xffffff, 0x203050, 1.0));
    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(200, 260, 120);
    scene.add(dir);

    // Helpers
    const grid = new THREE.GridHelper(420, 14, 0x2e4cff, 0x1e2a52);
    grid.position.y = 0;
    scene.add(grid);

    // ----- Plan data (matches the rectangles in buildFloorSVG) -----
    const rooms = [
      { id: "balcony",  x: 170, y: 80,  w: 640, h: 70,  color: 0x2a2f45, label: "Balcony" },
      { id: "parlour",  x: 105, y: 185, w: 420, h: 270, color: 0x203a7a, label: "Big Parlour" },
      { id: "guestWC",  x: 545, y: 185, w: 160, h: 130, color: 0x6a2f63, label: "Guest Toilet" },
      { id: "bed3",     x: 720, y: 185, w: 170, h: 130, color: 0x1a5b4a, label: "Bedroom 3" },
      { id: "wc3",      x: 720, y: 320, w: 170, h: 95,  color: 0x6a2f63, label: "Toilet (B3)" },
      { id: "bed1",     x: 105, y: 470, w: 270, h: 160, color: 0x1a5b4a, label: "Bedroom 1" },
      { id: "wc1",      x: 380, y: 470, w: 145, h: 110, color: 0x6a2f63, label: "Toilet (B1)" },
      { id: "bed2",     x: 545, y: 470, w: 270, h: 160, color: 0x1a5b4a, label: "Bedroom 2" },
      { id: "wc2",      x: 820, y: 470, w: 90,  h: 110, color: 0x6a2f63, label: "Toilet (B2)" },
      { id: "corridor", x: 545, y: 330, w: 170, h: 110, color: 0x2a2f45, label: "Corridor" },
    ];

    const outer = { x: 70, y: 120, w: 840, h: 520 };

    // Convert SVG coordinate space to 3D units
    const S = 0.22;
    const cx = outer.x + outer.w / 2;
    const cy = outer.y + outer.h / 2;

    // World scale constants (in "three units")
    const slabThickness = 4;
    const roomBlockHeight = 18; // used in stack mode
    const wallHeight = 22;
    const wallThickness = 5 * S; // in world units (already scaled)
    const floorGap = 28;

    const matCache = new Map();
    function mat(hex, kind="default") {
      const key = `${hex}:${kind}`;
      if (matCache.has(key)) return matCache.get(key);
      const m = new THREE.MeshStandardMaterial({
        color: hex,
        metalness: 0.05,
        roughness: 0.9,
        emissive: 0x000000,
        emissiveIntensity: 0.7,
      });
      matCache.set(key, m);
      return m;
    }

    function planToWorldX(px) { return (px - cx) * S; }
    function planToWorldZ(py) { return (py - cy) * S; }

    function makeBoxPlan(x, y, w, h, height, color) {
      const geo = new THREE.BoxGeometry(w * S, height, h * S);
      const mesh = new THREE.Mesh(geo, mat(color));
      mesh.position.set(planToWorldX(x + w / 2), height / 2, planToWorldZ(y + h / 2));
      return mesh;
    }

    function makeTextSprite(text) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const pad = 18;
      ctx.font = "bold 34px Arial";
      const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
      const h = 64;
      canvas.width = w;
      canvas.height = h;

      ctx.fillStyle = "rgba(17,26,53,0.88)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(46,76,255,0.9)";
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, w - 4, h - 4);

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 32px Arial";
      ctx.fillText(text, w / 2, h / 2);

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      const sm = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(sm);
      sprite.scale.set((w / 7.8) * 0.9, (h / 7.8) * 0.9, 1);
      return sprite;
    }

    // --- STACK MODE (your current model) ---
    function buildStackFloorGroup(floorIndex) {
      const g = new THREE.Group();

      const slabGeo = new THREE.BoxGeometry(outer.w * S, slabThickness, outer.h * S);
      const slab = new THREE.Mesh(
        slabGeo,
        new THREE.MeshStandardMaterial({ color: 0x111a35, metalness: 0.02, roughness: 0.95 })
      );
      slab.position.set(0, slabThickness / 2, 0);
      g.add(slab);

      // outline
      const outlineGeo = new THREE.BoxGeometry(outer.w * S, 2.2, outer.h * S);
      const outline = new THREE.Mesh(outlineGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }));
      outline.position.set(0, 1.1, 0);
      g.add(outline);

      rooms.forEach(r => {
        const box = makeBoxPlan(r.x, r.y, r.w, r.h, roomBlockHeight, r.color);
        box.position.y = slabThickness + roomBlockHeight / 2;
        g.add(box);
      });

      const label = makeTextSprite(`Floor ${floorIndex + 1}`);
      label.position.set(0, slabThickness + roomBlockHeight + 8, -outer.h * S * 0.42);
      label.userData.__label = true;
      g.add(label);

      return g;
    }

    function buildStackRoofGroup() {
      const g = new THREE.Group();
      const roofGeo = new THREE.BoxGeometry(outer.w * S, 10, outer.h * S);
      const roof = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: 0x1c2a55, roughness: 0.95 }));
      roof.position.set(0, 5, 0);
      g.add(roof);

      const signGeo = new THREE.BoxGeometry(540 * S, 8, 60 * S);
      const sign = new THREE.Mesh(signGeo, mat(0x2e4cff));
      sign.position.set(planToWorldX(220 + 540 / 2), 14, planToWorldZ(420 + 60 / 2));
      g.add(sign);

      const label = makeTextSprite("ROOF");
      label.position.set(0, 28, -outer.h * S * 0.42);
      label.userData.__label = true;
      g.add(label);

      return g;
    }

    // --- INTERIOR MODE (professional) ---
    function addSegment(segments, x1, y1, x2, y2) {
      // Normalize order so duplicates match
      const horiz = Math.abs(y1 - y2) < 1e-6;
      const vert = Math.abs(x1 - x2) < 1e-6;
      let key;
      if (horiz) {
        const a = Math.min(x1, x2), b = Math.max(x1, x2);
        key = `H:${y1.toFixed(2)}:${a.toFixed(2)}:${b.toFixed(2)}`;
      } else if (vert) {
        const a = Math.min(y1, y2), b = Math.max(y1, y2);
        key = `V:${x1.toFixed(2)}:${a.toFixed(2)}:${b.toFixed(2)}`;
      } else {
        // should not happen for rectangles
        key = `D:${x1}:${y1}:${x2}:${y2}`;
      }
      if (!segments.has(key)) segments.set(key, { x1, y1, x2, y2, key });
    }

    function buildWallsFromSegments(segMap, yBase, wallMat) {
      const wallsGroup = new THREE.Group();

      for (const seg of segMap.values()) {
        const horiz = Math.abs(seg.y1 - seg.y2) < 1e-6;
        const xMid = (seg.x1 + seg.x2) / 2;
        const yMid = (seg.y1 + seg.y2) / 2;

        if (horiz) {
          const len = Math.abs(seg.x2 - seg.x1) * S;
          const geo = new THREE.BoxGeometry(len, wallHeight, wallThickness);
          const mesh = new THREE.Mesh(geo, wallMat);
          mesh.position.set(planToWorldX(xMid), yBase + wallHeight / 2, planToWorldZ(yMid));
          wallsGroup.add(mesh);
        } else {
          const len = Math.abs(seg.y2 - seg.y1) * S;
          const geo = new THREE.BoxGeometry(wallThickness, wallHeight, len);
          const mesh = new THREE.Mesh(geo, wallMat);
          mesh.position.set(planToWorldX(xMid), yBase + wallHeight / 2, planToWorldZ(yMid));
          wallsGroup.add(mesh);
        }
      }

      return wallsGroup;
    }

    function buildInteriorFloorGroup(floorIndex) {
      const g = new THREE.Group();

      // floor slab
      const slabGeo = new THREE.BoxGeometry(outer.w * S, slabThickness, outer.h * S);
      const slab = new THREE.Mesh(
        slabGeo,
        new THREE.MeshStandardMaterial({ color: 0x111a35, metalness: 0.02, roughness: 0.95 })
      );
      slab.position.set(0, slabThickness / 2, 0);
      slab.userData.__slab = true;
      g.add(slab);

      // Room floors (clickable)
      const roomFloors = new THREE.Group();
      roomFloors.userData.__roomFloors = true;
      rooms.forEach(r => {
        const geo = new THREE.BoxGeometry(r.w * S, 1.2, r.h * S);
        const m = mat(r.color, "floor").clone();
        m.roughness = 0.95;
        m.metalness = 0.02;
        m.emissive = new THREE.Color(0x000000);
        const mesh = new THREE.Mesh(geo, m);
        mesh.position.set(planToWorldX(r.x + r.w / 2), slabThickness + 0.6, planToWorldZ(r.y + r.h / 2));
        mesh.userData.__roomId = r.id;
        mesh.userData.__roomLabel = r.label;
        mesh.userData.__roomRect = { ...r };
        roomFloors.add(mesh);
      });
      g.add(roomFloors);

      // Build wall segments from outer boundary + all room rectangles.
      const segs = new Map();

      // Outer rectangle
      addSegment(segs, outer.x, outer.y, outer.x + outer.w, outer.y);                 // top
      addSegment(segs, outer.x, outer.y + outer.h, outer.x + outer.w, outer.y + outer.h); // bottom
      addSegment(segs, outer.x, outer.y, outer.x, outer.y + outer.h);                 // left
      addSegment(segs, outer.x + outer.w, outer.y, outer.x + outer.w, outer.y + outer.h); // right

      // Inner partitions (rooms)
      rooms.forEach(r => {
        addSegment(segs, r.x, r.y, r.x + r.w, r.y);           // top
        addSegment(segs, r.x, r.y + r.h, r.x + r.w, r.y + r.h); // bottom
        addSegment(segs, r.x, r.y, r.x, r.y + r.h);           // left
        addSegment(segs, r.x + r.w, r.y, r.x + r.w, r.y + r.h); // right
      });

      const wallMat = new THREE.MeshStandardMaterial({
        color: 0xeaf0ff,
        roughness: 0.92,
        metalness: 0.02,
      });

      const walls = buildWallsFromSegments(segs, slabThickness, wallMat);
      walls.userData.__walls = true;
      g.add(walls);

      // Ceiling (toggle)
      const ceilGeo = new THREE.BoxGeometry(outer.w * S, 1.6, outer.h * S);
      const ceilMat = new THREE.MeshStandardMaterial({
        color: 0x0f1833,
        roughness: 0.98,
        metalness: 0.0,
        transparent: true,
        opacity: 0.75,
      });
      const ceil = new THREE.Mesh(ceilGeo, ceilMat);
      ceil.position.set(0, slabThickness + wallHeight + 1.0, 0);
      ceil.userData.__ceiling = true;
      ceil.visible = false;
      g.add(ceil);

      // Labels (toggle)
      const labels = new THREE.Group();
      labels.userData.__labels = true;
      rooms.forEach(r => {
        const s = makeTextSprite(r.label);
        s.position.set(planToWorldX(r.x + r.w/2), slabThickness + wallHeight + 8, planToWorldZ(r.y + r.h/2));
        s.userData.__label = true;
        labels.add(s);
      });
      g.add(labels);

      // Floor label
      const fl = makeTextSprite(`Floor ${floorIndex + 1}`);
      fl.position.set(0, slabThickness + wallHeight + 12, -outer.h * S * 0.42);
      fl.userData.__label = true;
      labels.add(fl);

      return g;
    }

    // Root groups
    const stackRoot = new THREE.Group();
    const interiorRoot = new THREE.Group();
    interiorRoot.visible = false;

    const stackFloors = [0,1,2,3].map(i => buildStackFloorGroup(i));
    const stackRoof = buildStackRoofGroup();

    stackFloors.forEach(g => stackRoot.add(g));
    stackRoot.add(stackRoof);

    const interiorFloors = [0,1,2,3].map(i => buildInteriorFloorGroup(i));
    const interiorRoof = buildStackRoofGroup(); // roof stays simple in interior mode
    interiorRoof.userData.__roof = true;
    interiorFloors.forEach(g => interiorRoot.add(g));
    interiorRoot.add(interiorRoof);

    scene.add(stackRoot);
    scene.add(interiorRoot);

    // Selection + interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered = null;
    let selected = null;

    function setHover(mesh) {
      if (hovered && hovered.material) hovered.material.emissive.setHex(0x000000);
      hovered = mesh;
      if (hovered && hovered.material) hovered.material.emissive.setHex(0x2030ff);
    }

    function setSelected(mesh) {
      if (selected && selected.material) {
        selected.material.emissive.setHex(0x000000);
        selected.material.emissiveIntensity = 0.7;
      }
      selected = mesh;
      if (selected && selected.material) {
        selected.material.emissive.setHex(0x2e4cff);
        selected.material.emissiveIntensity = 1.25;
      }
    }

    // Camera tween
    let tween = null;
    function startCameraTween({ targetPos, targetLookAt, duration = 520 }) {
      const fromPos = camera.position.clone();
      const fromTarget = controls.target.clone();
      const t0 = performance.now();
      tween = () => {
        const t = (performance.now() - t0) / duration;
        const k = Math.min(1, Math.max(0, t));
        const ease = k < 0.5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2)/2;

        camera.position.lerpVectors(fromPos, targetPos, ease);
        controls.target.lerpVectors(fromTarget, targetLookAt, ease);
        if (k >= 1) tween = null;
      };
    }

    function focusRoom(mesh) {
      if (!mesh) return;
      const rect = mesh.userData.__roomRect;
      const center = new THREE.Vector3(planToWorldX(rect.x + rect.w/2), slabThickness + 10, planToWorldZ(rect.y + rect.h/2));
      const size = Math.max(rect.w, rect.h) * S;
      const camOffset = new THREE.Vector3(size * 1.2, size * 0.95 + 40, size * 1.2);
      const pos = center.clone().add(camOffset);
      startCameraTween({ targetPos: pos, targetLookAt: center, duration: 650 });
    }

    function pick(event) {
      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);

      if (!interiorRoot.visible) {
        setHover(null);
        return;
      }

      const roomFloors = [];
      interiorRoot.traverse(obj => {
        if (obj.isMesh && obj.userData.__roomId) roomFloors.push(obj);
      });

      const hits = raycaster.intersectObjects(roomFloors, false);
      if (hits.length) {
        setHover(hits[0].object);
        renderer.domElement.style.cursor = "pointer";
      } else {
        setHover(null);
        renderer.domElement.style.cursor = "";
      }
    }

    renderer.domElement.addEventListener("pointermove", pick);

    renderer.domElement.addEventListener("click", (e) => {
      if (!interiorRoot.visible) return;
      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -(((e.clientY - bounds.top) / bounds.height) * 2 - 1);
      raycaster.setFromCamera(mouse, camera);

      const roomFloors = [];
      interiorRoot.traverse(obj => {
        if (obj.isMesh && obj.userData.__roomId) roomFloors.push(obj);
      });

      const hits = raycaster.intersectObjects(roomFloors, false);
      if (hits.length) {
        const mesh = hits[0].object;
        setSelected(mesh);
        focusRoom(mesh);
        if (hint) hint.textContent = `Selected: ${mesh.userData.__roomLabel} — click another room to focus`;
      }
    });

    fitRoomBtn?.addEventListener("click", () => {
      if (!selected) return;
      focusRoom(selected);
    });

    // Layout
    function applyView() {
      const view = viewSelect?.value || "all";
      const roots = interiorRoot.visible ? interiorFloors : stackFloors;

      roots.forEach((g, i) => (g.visible = view === "all" || view === `floor${i + 1}`));
      if (interiorRoot.visible) {
        interiorRoof.visible = view === "all" || view === "roof";
      } else {
        stackRoof.visible = view === "all" || view === "roof";
      }
    }

    function applyExplode() {
      const explode = Number(explodeRange?.value ?? 40);
      const amt = explode * 0.15;
      const roots = interiorRoot.visible ? interiorFloors : stackFloors;
      roots.forEach((g, i) => { g.position.y = i * floorGap + i * amt; });
      const roofY = roots.length * floorGap + roots.length * amt;
      if (interiorRoot.visible) interiorRoof.position.y = roofY;
      else stackRoof.position.y = roofY;
    }

    function applyToggles() {
      const showWalls = wallsToggle?.checked ?? true;
      const showCeil = ceilingToggle?.checked ?? false;
      const showLabels = labelsToggle?.checked ?? true;

      interiorFloors.forEach(f => {
        f.traverse(obj => {
          if (obj.userData.__walls) obj.visible = showWalls;
          if (obj.userData.__ceiling) obj.visible = showCeil;
          if (obj.userData.__labels) obj.visible = showLabels;
          if (obj.userData.__label && obj.parent?.userData.__labels) obj.visible = showLabels;
        });
      });
    }

    function applyMode() {
      const mode = modeSelect?.value || "stack";
      const interior = mode === "interior";
      interiorRoot.visible = interior;
      stackRoot.visible = !interior;

      // Good default camera for interior
      if (interior) {
        controls.reset(new THREE.Vector3(190, 210, 190), new THREE.Vector3(0, slabThickness + 10, 0));
        if (hint) hint.textContent = "Interior mode: click a room to focus • toggle walls/ceiling/labels";
      } else {
        controls.reset(new THREE.Vector3(220, 190, 220), new THREE.Vector3(0, 18, 0));
        if (hint) hint.textContent = "Stack mode: inspect floors • use Explode to separate";
      }

      applyView();
      applyExplode();
      applyToggles();
      setHover(null);
      setSelected(null);
    }

    modeSelect?.addEventListener("change", applyMode);
    viewSelect?.addEventListener("change", applyView);
    explodeRange?.addEventListener("input", applyExplode);
    wallsToggle?.addEventListener("change", applyToggles);
    ceilingToggle?.addEventListener("change", applyToggles);
    labelsToggle?.addEventListener("change", applyToggles);

    resetBtn?.addEventListener("click", () => {
      applyMode(); // resets to mode defaults
    });

    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    applyMode();

    function animate() {
      controls.update();
      if (tween) tween();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }
});
