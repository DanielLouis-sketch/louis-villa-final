import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js";

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
    plansGrid.appendChild(card);

    const canvas = card.querySelector(`#${f.id}`);
    const svg = buildFloorSVG({ topLabel: f.topLabel });
    canvas.appendChild(svg);
  });

  // Roof plan
  roofCanvas.appendChild(buildRoofSVG());

  // Zoom plans
  scaleSelect.addEventListener("change", () => {
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
      downloadSVG(roofCanvas.querySelector("svg"), "Louis_Villa_Roof.svg");
      return;
    }

    const floorEl = document.getElementById(id);
    const svg = floorEl?.querySelector("svg");
    downloadSVG(svg, `Louis_Villa_${id}.svg`);
  });

  // Download all plans
  downloadAllBtn.addEventListener("click", () => {
    floors.forEach(f => {
      const svg = document.getElementById(f.id)?.querySelector("svg");
      downloadSVG(svg, `Louis_Villa_${f.id}.svg`);
    });
    downloadSVG(roofCanvas.querySelector("svg"), "Louis_Villa_Roof.svg");
  });

  // Apply initial zoom
  document.querySelectorAll("svg[data-scalable='true']").forEach(svg => {
    svg.style.transform = `scale(${currentScale})`;
  });

  

  // Initialize 3D viewer (interactive)
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

  // ---------- 3D Viewer (Three.js) ----------
  function init3DViewer() {
    const container = document.getElementById("threeContainer");
    const viewSelect = document.getElementById("viewSelect");
    const explodeRange = document.getElementById("explodeRange");
    const resetBtn = document.getElementById("resetCamBtn");
    const hint = document.getElementById("threeHint");

    if (!container) return;

    // If the module fails to load for any reason, show a helpful message.
    if (!THREE || !OrbitControls) {
      if (hint) hint.textContent = "3D libraries failed to load. Check your internet/CDN access.";
      return;
    }

    // Clear container
    container.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e162f);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
    camera.position.set(220, 190, 220);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 20, 0);

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x203050, 1.0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(200, 260, 120);
    scene.add(dir);

    // Helpers
    const grid = new THREE.GridHelper(420, 14, 0x2e4cff, 0x1e2a52);
    grid.position.y = 0;
    scene.add(grid);

    // ----- Geometry mapping from your SVG plan -----
    // These coordinates match the rectangles in buildFloorSVG() (app.js).  
    const rooms = [
      { id: "balcony",  x: 170, y: 80,  w: 640, h: 70,  color: 0x2a2f45, label: "Balcony" },
      { id: "parlour",  x: 105, y: 185, w: 420, h: 270, color: 0x203a7a, label: "Big Parlour" },
      { id: "guestWC",  x: 545, y: 185, w: 160, h: 130, color: 0x6a2f63, label: "Guest Toilet" },
      { id: "bed3",     x: 720, y: 185, w: 170, h: 130, color: 0x1a5b4a, label: "Bedroom 3" },
      { id: "wc3",      x: 720, y: 320, w: 170, h: 95,  color: 0x6a2f63, label: "Toilet" },
      { id: "bed1",     x: 105, y: 470, w: 270, h: 160, color: 0x1a5b4a, label: "Bedroom 1" },
      { id: "wc1",      x: 380, y: 470, w: 145, h: 110, color: 0x6a2f63, label: "Toilet" },
      { id: "bed2",     x: 545, y: 470, w: 270, h: 160, color: 0x1a5b4a, label: "Bedroom 2" },
      { id: "wc2",      x: 820, y: 470, w: 90,  h: 110, color: 0x6a2f63, label: "Toilet" },
      { id: "corridor", x: 545, y: 330, w: 170, h: 110, color: 0x2a2f45, label: "Corridor" },
    ];

    // Outer wall footprint (from buildFloorSVG outer wall)
    const outer = { x: 70, y: 120, w: 840, h: 520 };

    // Convert SVG coordinate space to 3D units
    const S = 0.22; // scale down to nice units
    const cx = outer.x + outer.w / 2;
    const cy = outer.y + outer.h / 2;

    const slabThickness = 6;
    const roomHeight = 18;
    const floorGap = 26;

    const materialCache = new Map();
    function mat(hex) {
      if (materialCache.has(hex)) return materialCache.get(hex);
      const m = new THREE.MeshStandardMaterial({ color: hex, metalness: 0.05, roughness: 0.9 });
      materialCache.set(hex, m);
      return m;
    }

    function makeBox(x, y, w, h, height, color) {
      const geo = new THREE.BoxGeometry(w * S, height, h * S);
      const mesh = new THREE.Mesh(geo, mat(color));
      mesh.position.set((x + w / 2 - cx) * S, height / 2, (y + h / 2 - cy) * S);
      return mesh;
    }

    function makeOutline(x, y, w, h) {
      // A low "wall" outline
      const geo = new THREE.BoxGeometry(w * S, 2.2, h * S);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0, roughness: 1 }));
      mesh.position.set((x + w / 2 - cx) * S, 1.1, (y + h / 2 - cy) * S);
      return mesh;
    }

    function buildFloorGroup(floorIndex) {
      const g = new THREE.Group();

      // slab
      const slabGeo = new THREE.BoxGeometry(outer.w * S, slabThickness, outer.h * S);
      const slab = new THREE.Mesh(
        slabGeo,
        new THREE.MeshStandardMaterial({ color: 0x111a35, metalness: 0.02, roughness: 0.95 })
      );
      slab.position.set(0, slabThickness / 2, 0);
      g.add(slab);

      // outline
      g.add(makeOutline(outer.x, outer.y, outer.w, outer.h));

      // rooms
      rooms.forEach(r => {
        const box = makeBox(r.x, r.y, r.w, r.h, roomHeight, r.color);
        box.position.y = slabThickness + roomHeight / 2;
        g.add(box);
      });

      // label plate (only floor 4 in your 2D shows top label, but in 3D we label all floors)
      const label = makeTextSprite(`Floor ${floorIndex + 1}`);
      label.position.set(0, slabThickness + roomHeight + 8, -outer.h * S * 0.42);
      g.add(label);

      return g;
    }

    function buildRoofGroup() {
      const g = new THREE.Group();
      const roofGeo = new THREE.BoxGeometry(outer.w * S, 10, outer.h * S);
      const roof = new THREE.Mesh(
        roofGeo,
        new THREE.MeshStandardMaterial({ color: 0x1c2a55, metalness: 0.03, roughness: 0.95 })
      );
      roof.position.set(0, 5, 0);
      g.add(roof);

      const signGeo = new THREE.BoxGeometry(540 * S, 8, 60 * S);
      const sign = new THREE.Mesh(signGeo, mat(0x2e4cff));
      // matches roof sign placement roughly (x=220..760, y=420..480)
      const signX = (220 + 540 / 2 - cx) * S;
      const signZ = (420 + 60 / 2 - cy) * S;
      sign.position.set(signX, 14, signZ);
      g.add(sign);

      const label = makeTextSprite("ROOF");
      label.position.set(0, 28, -outer.h * S * 0.42);
      g.add(label);

      return g;
    }

    function makeTextSprite(text) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const pad = 18;
      ctx.font = "bold 36px Arial";
      const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
      const h = 64;
      canvas.width = w;
      canvas.height = h;

      // background
      ctx.fillStyle = "rgba(17,26,53,0.85)";
      ctx.fillRect(0, 0, w, h);

      // border
      ctx.strokeStyle = "rgba(46,76,255,0.9)";
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, w - 4, h - 4);

      // text
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 34px Arial";
      ctx.fillText(text, w / 2, h / 2);

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;

      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set((w / 7.5) * 0.9, (h / 7.5) * 0.9, 1);
      return sprite;
    }

    const floors3D = [
      buildFloorGroup(0),
      buildFloorGroup(1),
      buildFloorGroup(2),
      buildFloorGroup(3),
    ];
    const roof3D = buildRoofGroup();

    const root = new THREE.Group();
    floors3D.forEach(f => root.add(f));
    root.add(roof3D);
    scene.add(root);

    function applyView() {
      const view = viewSelect?.value || "all";

      floors3D.forEach((g, i) => (g.visible = view === "all" || view === `floor${i + 1}`));
      roof3D.visible = view === "all" || view === "roof";
    }

    function applyExplode() {
      const explode = Number(explodeRange?.value ?? 40);
      floors3D.forEach((g, i) => {
        g.position.y = i * floorGap + i * (explode * 0.15);
      });
      roof3D.position.y = floors3D.length * floorGap + floors3D.length * (explode * 0.15);
    }

    viewSelect?.addEventListener("change", () => {
      applyView();
    });

    explodeRange?.addEventListener("input", () => {
      applyExplode();
    });

    resetBtn?.addEventListener("click", () => {
      camera.position.set(220, 190, 220);
      controls.target.set(0, 20, 0);
      controls.update();
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

    applyView();
    applyExplode();

    function animate() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }


});