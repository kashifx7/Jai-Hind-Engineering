/**
 * JAI HIND ENGINEERING WORKS - 360° & 3D PRODUCT INSPECTOR
 * Features:
 * - 360 Turntable multi-angle image scrubber using HD imagery
 * - Interactive technical hotspot inspection pins
 * - Multi-product switching (Fridges, Counters, Ice Cream & Cone Maker, Defridgers)
 * - 3D CAD WebGL canvas mode (procedural 3D model & slot for future .GLB/.GLTF files)
 */

(function () {
  'use strict';

  // Product configurations & HD angle frame mappings
  const PRODUCTS_DATA = {
    fridge: {
      name: 'Commercial Display Refrigerator (JHE-CR-450)',
      category: 'Commercial Refrigeration',
      specs: {
        model: 'JHE-CR-450 Visi Cooler',
        temp: '+1°C to +8°C Uniform Air',
        compressor: 'Embraco Aspera Tropical 1/4 HP',
        steel: '1.2mm SS-304 Food Grade'
      },
      frames: [
        { minAngle: 315, maxAngle: 45, src: 'IMG/major-fridge.jpg', label: 'Front HD Showcase (0°)' },
        { minAngle: 45, maxAngle: 135, src: 'IMG/image-2.jpeg', label: 'Isometric Quarter Angle (45°)' },
        { minAngle: 135, maxAngle: 225, src: 'IMG/image-3.jpeg', label: 'Side Heat Dissipation (90°-180°)' },
        { minAngle: 225, maxAngle: 315, src: 'IMG/image-4.jpeg', label: 'Internal Shelves & Air Curtain (270°)' }
      ],
      hotspots: [
        {
          id: 1,
          x: 50,
          y: 22,
          tag: 'Digital Control',
          title: 'Sub-Zero Microprocessor Hub',
          desc: 'High-precision temperature display with auto-defrost cycle programming.'
        },
        {
          id: 2,
          x: 75,
          y: 45,
          tag: 'Food Safety',
          title: 'Food-Grade SS-304 Non-Magnetic',
          desc: '1.2mm heavy gauge sheet metal with corrosion-resistant brushed hairline finish.'
        },
        {
          id: 3,
          x: 48,
          y: 80,
          tag: 'Compressor Unit',
          title: 'Embraco Tropicalized Hermetic',
          desc: 'Eco-safe R-134a refrigerant engineered for peak 48°C ambient Indian summers.'
        }
      ]
    },
    counter: {
      name: 'Curved Glass Sweet & Bakery Counter (JHE-SC-800)',
      category: 'Display Counters',
      specs: {
        model: 'JHE-SC-800 Mithai Counter',
        temp: '+2°C to +10°C / Ambient Dual',
        compressor: 'Tecumseh Silent Chiller 1/3 HP',
        steel: '10mm Curved Glass + SS-304'
      },
      frames: [
        { minAngle: 315, maxAngle: 45, src: 'IMG/major-counter.jpg', label: 'Front Bakery & Mithai View (0°)' },
        { minAngle: 45, maxAngle: 135, src: 'IMG/counter-2.jpeg', label: 'Isometric Display Angle (45°)' },
        { minAngle: 135, maxAngle: 225, src: 'IMG/counter-3.jpeg', label: 'Side Service Profile (90°-180°)' },
        { minAngle: 225, maxAngle: 315, src: 'IMG/counter-4.jpeg', label: 'Internal Stainless Steel Pan Wells (270°)' }
      ],
      hotspots: [
        {
          id: 1,
          x: 50,
          y: 35,
          tag: 'Display Glass',
          title: '10mm Curved Toughened Glass',
          desc: 'Crystal-clear anti-fog glass with heated border to prevent condensation.'
        },
        {
          id: 2,
          x: 30,
          y: 60,
          tag: 'Warm Lighting',
          title: 'High-CRI 3000K Golden LED',
          desc: 'Food-safe warm illumination designed specifically for sweets & confectionery.'
        },
        {
          id: 3,
          x: 80,
          y: 75,
          tag: 'Base Chassis',
          title: 'Rigid Box Section SS Frame',
          desc: 'Heavy-duty argon-welded frame with lockable 360° polyurethane castor wheels.'
        }
      ]
    },
    icecream: {
      name: 'Soft Serve & Cone Cream Dispenser (JHE-IC-320)',
      category: 'Ice Cream Machinery',
      specs: {
        model: 'JHE-IC-320 Soft Serve & Cone',
        temp: '-8°C Rapid Freezing Well',
        compressor: 'Twin Cryogenic R-404A Engine',
        steel: 'Dual SS-304 Freezing Wells'
      },
      frames: [
        { minAngle: 315, maxAngle: 45, src: 'IMG/major-icecream.jpg', label: 'Soft Serve Dispenser (0°)' },
        { minAngle: 45, maxAngle: 135, src: 'IMG/major-cone-maker.jpg', label: 'Cone Making Station (45°)' },
        { minAngle: 135, maxAngle: 225, src: 'IMG/ice-cream-machine-3.jpeg', label: 'Flash Hardener Unit (90°-180°)' },
        { minAngle: 225, maxAngle: 315, src: 'IMG/ice-cream-machine-4.jpeg', label: 'Batch Churning Engine (270°)' }
      ],
      hotspots: [
        {
          id: 1,
          x: 50,
          y: 28,
          tag: 'Twin Hoppers',
          title: 'Dual SS-304 Freezing Cylinders',
          desc: 'Independent refrigeration circuits for dual flavor dispensing.'
        },
        {
          id: 2,
          x: 50,
          y: 55,
          tag: 'Dispense Levers',
          title: 'Ergonomic 3-Handle Dispenser',
          desc: 'Heavy chrome-plated stainless steel handles with auto-spring return.'
        },
        {
          id: 3,
          x: 75,
          y: 80,
          tag: 'Air Ventilation',
          title: 'Cross-Flow Air Intake',
          desc: 'High CFM industrial condenser motor with washable lint filter.'
        }
      ]
    },
    defriger: {
      name: 'Sub-Zero Cryo Deep Freezer (JHE-DF-500)',
      category: 'Deep Storage Freezers',
      specs: {
        model: 'JHE-DF-500 Cryo Deep Freezer',
        temp: '-18°C to -24°C Sub-Zero',
        compressor: 'Tecumseh Cryo 1/3 HP',
        steel: '70mm Injected PUF + Copper Coils'
      },
      frames: [
        { minAngle: 315, maxAngle: 45, src: 'IMG/major-defriger.jpg', label: 'Front Hard-Top View (0°)' },
        { minAngle: 45, maxAngle: 135, src: 'IMG/image-3.jpeg', label: 'Deep Storage Cavity (45°)' },
        { minAngle: 135, maxAngle: 225, src: 'IMG/image-2.jpeg', label: 'External Condenser Grid (90°-180°)' },
        { minAngle: 225, maxAngle: 315, src: 'IMG/major-fridge.jpg', label: 'Multi-Compartment View (270°)' }
      ],
      hotspots: [
        {
          id: 1,
          x: 50,
          y: 35,
          tag: 'Sub-Zero Temp',
          title: '-24°C Cryogenic Deep Chilling',
          desc: 'R-404A refrigerant circuit with 70mm injected PUF insulation for 14-hour retention.'
        },
        {
          id: 2,
          x: 80,
          y: 70,
          tag: 'Condenser Bay',
          title: 'Heavy Tropicalized Tecumseh Unit',
          desc: 'Continuous duty hermetic compressor with external heat sink fan.'
        }
      ]
    }
  };

  // State
  let currentProductId = 'fridge';
  let currentAngle = 0; // 0 to 359
  let isDragging = false;
  let startX = 0;
  let startAngle = 0;
  let autoRotateInterval = null;
  let isAutoRotate = false;
  let currentMode = 'turntable';
  let isWireframe = false;

  // DOM Elements
  const stage = document.getElementById('viewer-stage');
  const frameImg = document.getElementById('turntable-img');
  const scrubber = document.getElementById('angle-slider');
  const angleReadout = document.getElementById('angle-readout');
  const hotspotsLayer = document.getElementById('hotspots-layer');
  const productButtons = document.querySelectorAll('.viewer-product-btn');
  const modeButtons = document.querySelectorAll('.mode-btn');
  const presetButtons = document.querySelectorAll('.preset-btn');
  const autoRotateBtn = document.getElementById('auto-rotate-btn');
  const resetBtn = document.getElementById('reset-view-btn');
  const wireframeBtn = document.getElementById('wireframe-btn');
  const cadCanvas = document.getElementById('cad-canvas');

  function initViewer() {
    if (!stage || !frameImg) return;

    setupEventListeners();
    renderProductHotspots();
    updateViewer(0);
    updateSpecsStrip('fridge');
    init3DCanvas();
  }

  function updateSpecsStrip(productId) {
    const data = PRODUCTS_DATA[productId];
    if (!data || !data.specs) return;
    const modelEl = document.getElementById('spec-strip-model');
    const tempEl = document.getElementById('spec-strip-temp');
    const compEl = document.getElementById('spec-strip-compressor');
    const steelEl = document.getElementById('spec-strip-steel');
    const quoteBtn = document.getElementById('viewer-quote-btn');

    if (modelEl) modelEl.textContent = data.specs.model;
    if (tempEl) tempEl.textContent = data.specs.temp;
    if (compEl) compEl.textContent = data.specs.compressor;
    if (steelEl) steelEl.textContent = data.specs.steel;
    if (quoteBtn) quoteBtn.setAttribute('data-product-type', data.name);
  }

  function updateViewer(angle) {
    currentAngle = ((Math.round(angle) % 360) + 360) % 360;

    if (scrubber) scrubber.value = currentAngle;
    if (angleReadout) {
      angleReadout.textContent = `${String(currentAngle).padStart(3, '0')}°`;
    }

    const product = PRODUCTS_DATA[currentProductId];
    if (!product) return;

    let matchedSrc = product.frames[0].src;

    for (const frame of product.frames) {
      if (frame.minAngle > frame.maxAngle) {
        if (currentAngle >= frame.minAngle || currentAngle < frame.maxAngle) {
          matchedSrc = frame.src;
          break;
        }
      } else {
        if (currentAngle >= frame.minAngle && currentAngle < frame.maxAngle) {
          matchedSrc = frame.src;
          break;
        }
      }
    }

    if (frameImg.getAttribute('src') !== matchedSrc) {
      frameImg.src = matchedSrc;
    }

    const skewFactor = Math.sin((currentAngle * Math.PI) / 180) * 1.5;
    frameImg.style.transform = `scale(1) skewY(${skewFactor * 0.3}deg)`;

    presetButtons.forEach(btn => {
      const btnAngle = parseInt(btn.getAttribute('data-angle'), 10);
      if (Math.abs(currentAngle - btnAngle) <= 15) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (window.jhe3dScene && window.jhe3dScene.mesh) {
      window.jhe3dScene.mesh.rotation.y = (currentAngle * Math.PI) / 180;
    }
  }

  function renderProductHotspots() {
    if (!hotspotsLayer) return;
    hotspotsLayer.innerHTML = '';

    const product = PRODUCTS_DATA[currentProductId];
    if (!product || !product.hotspots) return;

    product.hotspots.forEach(spot => {
      const pin = document.createElement('div');
      pin.className = 'hotspot-pin';
      pin.style.left = `${spot.x}%`;
      pin.style.top = `${spot.y}%`;
      pin.setAttribute('role', 'button');
      pin.setAttribute('tabindex', '0');
      pin.setAttribute('aria-label', `${spot.title}: ${spot.desc}`);

      pin.innerHTML = `
        <div class="hotspot-dot">${spot.id}</div>
        <div class="hotspot-tooltip">
          <div class="tooltip-tag">${spot.tag}</div>
          <div class="tooltip-title">${spot.title}</div>
          <div class="tooltip-desc">${spot.desc}</div>
        </div>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasActive = pin.classList.contains('active');
        document.querySelectorAll('.hotspot-pin').forEach(p => p.classList.remove('active'));
        if (!wasActive) pin.classList.add('active');
      });

      hotspotsLayer.appendChild(pin);
    });
  }

  function setupEventListeners() {
    stage.addEventListener('mousedown', (e) => {
      if (e.target.closest('.hotspot-pin') || e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      startAngle = currentAngle;
      stage.classList.add('grabbing');
      stopAutoRotate();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const newAngle = startAngle + deltaX * 0.65;
      updateViewer(newAngle);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        stage.classList.remove('grabbing');
      }
    });

    stage.addEventListener('touchstart', (e) => {
      if (e.target.closest('.hotspot-pin') || e.target.closest('button')) return;
      isDragging = true;
      startX = e.touches[0].clientX;
      startAngle = currentAngle;
      stopAutoRotate();
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      const newAngle = startAngle + deltaX * 0.65;
      updateViewer(newAngle);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        stopAutoRotate();
        updateViewer(parseFloat(e.target.value));
      });
    }

    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stopAutoRotate();
        const targetAngle = parseInt(btn.getAttribute('data-angle'), 10);
        animateToAngle(targetAngle);
      });
    });

    productButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = btn.getAttribute('data-product');
        if (prod && PRODUCTS_DATA[prod]) {
          currentProductId = prod;
          productButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderProductHotspots();
          updateViewer(currentAngle);
          updateSpecsStrip(prod);
          if (window.jhe3dScene) {
            window.jhe3dScene.render();
          }
        }
      });
    });

    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (!mode) return;
        currentMode = mode;
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const turntableContainer = document.querySelector('.turntable-container');
        const futureBadge = document.querySelector('.future-3d-banner');

        if (mode === 'cad-3d') {
          if (turntableContainer) turntableContainer.style.display = 'none';
          if (cadCanvas) cadCanvas.classList.add('active');
          if (futureBadge) futureBadge.style.display = 'block';
          if (wireframeBtn) wireframeBtn.style.display = 'inline-flex';
          if (window.jhe3dScene && window.jhe3dScene.render) {
            window.jhe3dScene.render();
          }
        } else {
          if (turntableContainer) turntableContainer.style.display = 'flex';
          if (cadCanvas) cadCanvas.classList.remove('active');
          if (futureBadge) futureBadge.style.display = 'none';
          if (wireframeBtn) wireframeBtn.style.display = 'none';
          updateViewer(currentAngle);
        }
      });
    });

    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        if (isAutoRotate) {
          stopAutoRotate();
        } else {
          startAutoRotate();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        stopAutoRotate();
        animateToAngle(0);
      });
    }

    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        isWireframe = !isWireframe;
        wireframeBtn.classList.toggle('active', isWireframe);
        if (window.jhe3dScene && window.jhe3dScene.setWireframe) {
          window.jhe3dScene.setWireframe(isWireframe);
        }
      });
    }

    document.addEventListener('click', () => {
      document.querySelectorAll('.hotspot-pin').forEach(p => p.classList.remove('active'));
    });
  }

  function animateToAngle(targetAngle) {
    const start = currentAngle;
    let diff = (targetAngle - start) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const startTime = performance.now();
    const duration = 300;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      updateViewer(start + diff * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function startAutoRotate() {
    isAutoRotate = true;
    if (autoRotateBtn) autoRotateBtn.classList.add('active');
    if (autoRotateInterval) clearInterval(autoRotateInterval);

    autoRotateInterval = setInterval(() => {
      updateViewer(currentAngle + 1);
    }, 40);
  }

  function stopAutoRotate() {
    isAutoRotate = false;
    if (autoRotateBtn) autoRotateBtn.classList.remove('active');
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  // 3D Canvas Engine
  function init3DCanvas() {
    if (!cadCanvas) return;
    const ctx = cadCanvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
      const rect = stage.getBoundingClientRect();
      cadCanvas.width = rect.width * window.devicePixelRatio;
      cadCanvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const baseWidth = 140;
    const baseHeight = 220;
    const baseDepth = 120;

    const vertices = [
      [-baseWidth, -baseHeight, -baseDepth],
      [baseWidth, -baseHeight, -baseDepth],
      [baseWidth, baseHeight, -baseDepth],
      [-baseWidth, baseHeight, -baseDepth],
      [-baseWidth, -baseHeight, baseDepth],
      [baseWidth, -baseHeight, baseDepth],
      [baseWidth, baseHeight, baseDepth],
      [-baseWidth, baseHeight, baseDepth]
    ];

    const faces = [
      [0, 1, 2, 3, '#101626'],
      [4, 5, 6, 7, 'rgba(0, 210, 255, 0.22)'],
      [0, 4, 7, 3, '#141d33'],
      [1, 5, 6, 2, '#1e2945'],
      [3, 2, 6, 7, '#0b101c'],
      [0, 1, 5, 4, '#070a12']
    ];

    const shelfYLevels = [-50, 20, 90];
    let rotY = 0;
    let rotX = 0.22;

    function project(p, angleRad) {
      const cosY = Math.cos(angleRad);
      const sinY = Math.sin(angleRad);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const x1 = p[0] * cosY - p[2] * sinY;
      const z1 = p[0] * sinY + p[2] * cosY;

      const y2 = p[1] * cosX - z1 * sinX;
      const z2 = p[1] * sinX + z1 * cosX;

      const fov = 480;
      const distance = 580;
      const z = z2 + distance;
      const scale = fov / Math.max(z, 1);

      const cx = stage.clientWidth / 2;
      const cy = stage.clientHeight / 2;

      return [x1 * scale + cx, y2 * scale + cy, z2];
    }

    function render3D() {
      if (currentMode !== 'cad-3d') return;

      const w = stage.clientWidth;
      const h = stage.clientHeight;
      ctx.clearRect(0, 0, w, h);

      rotY = (currentAngle * Math.PI) / 180;
      const projected = vertices.map(v => project(v, rotY));

      // Floor Grid
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.12)';
      ctx.lineWidth = 1;
      const gridRadius = 240;
      ctx.beginPath();
      for (let r = -gridRadius; r <= gridRadius; r += 40) {
        const p1 = project([r, baseHeight + 10, -gridRadius], rotY);
        const p2 = project([r, baseHeight + 10, gridRadius], rotY);
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);

        const p3 = project([-gridRadius, baseHeight + 10, r], rotY);
        const p4 = project([gridRadius, baseHeight + 10, r], rotY);
        ctx.moveTo(p3[0], p3[1]);
        ctx.lineTo(p4[0], p4[1]);
      }
      ctx.stroke();

      const sortedFaces = faces.map((face, index) => {
        const zAvg = (projected[face[0]][2] + projected[face[1]][2] + projected[face[2]][2] + projected[face[3]][2]) / 4;
        return { face, index, zAvg, color: face[4] };
      }).sort((a, b) => b.zAvg - a.zAvg);

      sortedFaces.forEach(item => {
        const f = item.face;
        ctx.beginPath();
        ctx.moveTo(projected[f[0]][0], projected[f[0]][1]);
        ctx.lineTo(projected[f[1]][0], projected[f[1]][1]);
        ctx.lineTo(projected[f[2]][0], projected[f[2]][1]);
        ctx.lineTo(projected[f[3]][0], projected[f[3]][1]);
        ctx.closePath();

        if (isWireframe) {
          ctx.strokeStyle = '#00d2ff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = item.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      shelfYLevels.forEach(sy => {
        const s0 = project([-baseWidth + 5, sy, -baseDepth + 5], rotY);
        const s1 = project([baseWidth - 5, sy, -baseDepth + 5], rotY);
        const s2 = project([baseWidth - 5, sy, baseDepth - 5], rotY);
        const s3 = project([-baseWidth + 5, sy, baseDepth - 5], rotY);

        ctx.beginPath();
        ctx.moveTo(s0[0], s0[1]);
        ctx.lineTo(s1[0], s1[1]);
        ctx.lineTo(s2[0], s2[1]);
        ctx.lineTo(s3[0], s3[1]);
        ctx.closePath();
        ctx.strokeStyle = isWireframe ? '#f59e0b' : 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Digital Sub-Zero LED display mock on top front
      const d1 = project([-35, -baseHeight + 15, baseDepth + 1], rotY);
      const d2 = project([35, -baseHeight + 15, baseDepth + 1], rotY);
      const d3 = project([35, -baseHeight + 35, baseDepth + 1], rotY);
      const d4 = project([-35, -baseHeight + 35, baseDepth + 1], rotY);

      ctx.beginPath();
      ctx.moveTo(d1[0], d1[1]);
      ctx.lineTo(d2[0], d2[1]);
      ctx.lineTo(d3[0], d3[1]);
      ctx.lineTo(d4[0], d4[1]);
      ctx.closePath();
      ctx.fillStyle = '#060a12';
      ctx.fill();
      ctx.strokeStyle = '#00d2ff';
      ctx.stroke();

      ctx.fillStyle = '#00d2ff';
      ctx.font = '10px monospace';
      ctx.fillText('-02°C', d1[0] + 12, d1[1] + 14);

      requestAnimationFrame(render3D);
    }

    window.jhe3dScene = {
      render: render3D,
      setWireframe: function (wf) {
        isWireframe = wf;
      }
    };

    render3D();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewer);
  } else {
    initViewer();
  }

})();
