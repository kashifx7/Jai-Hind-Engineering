/**
 * JAI HIND ENGINEERING WORKS - 360° & 3D PRODUCT INSPECTOR
 * Features:
 * - Real-time 3D GLB CAD Model Rendering via Google <model-viewer>
 * - 360 Turntable multi-angle image scrubber using HD imagery
 * - Interactive technical hotspot inspection pins
 * - Multi-product switching (Commercial Fridge, Mithai Counter, Ice Cream Machine, Defridger Freezer, Compressor, Motor, Fan)
 * - 3D & 360 Mode switching with bi-directional orbit & angle scrubber synchronization
 */

(function () {
  'use strict';

  // Product configurations, 3D GLB assets & HD angle frame mappings
  const PRODUCTS_DATA = {
    fridge: {
      name: 'Commercial Display Refrigerator (JHE-CR-450)',
      category: 'Commercial Refrigeration',
      glb: 'assets/CadModels/fridge.glb',
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
      glb: null,
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
      glb: 'assets/CadModels/icecreammachine.glb',
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
      glb: null,
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
    },
    compressor: {
      name: 'Embraco Hermetic Compressor (JHE-CMP-EM65)',
      category: 'Refrigeration Components',
      glb: 'assets/CadModels/compressor.glb',
      specs: {
        model: 'JHE-CMP-EM65 Hermetic Compressor',
        temp: '-10°C to +7.2°C Evaporating',
        compressor: 'Embraco 1/4 HP Tropical R-134a',
        steel: 'Coated Hermetic Steel Shell'
      },
      frames: [
        { minAngle: 315, maxAngle: 45, src: 'IMG/comp-compressor.jpg', label: 'Front Suction/Discharge Ports (0°)' },
        { minAngle: 45, maxAngle: 135, src: 'IMG/comp-compressor.jpg', label: 'Side Terminal Housing (45°-90°)' },
        { minAngle: 135, maxAngle: 225, src: 'IMG/comp-compressor.jpg', label: 'Rear Mounting Feet & Oil Sump (180°)' },
        { minAngle: 225, maxAngle: 315, src: 'IMG/comp-compressor.jpg', label: 'Process Tube Profile (270°)' }
      ],
      hotspots: [
        {
          id: 1,
          x: 42,
          y: 35,
          tag: 'Copper Ports',
          title: 'Suction & Discharge Stubs',
          desc: 'Heavy-gauge brazed copper tubes for leak-proof connection to condenser circuits.'
        },
        {
          id: 2,
          x: 65,
          y: 50,
          tag: 'Motor Chamber',
          title: 'Hermetic Motor Chamber',
          desc: 'Tropicalized continuous-duty motor rated for 48°C ambient with internal thermal overload protection.'
        },
        {
          id: 3,
          x: 35,
          y: 75,
          tag: 'Vibration Mounts',
          title: 'Neoprene Anti-Vibration Grommets',
          desc: 'Heavy-duty rubber suspension grommets preventing noise transmission to cabinet frame.'
        }
      ]
    },
    motor: {
      name: 'Shaded Pole Condenser Motor (JHE-MTR-16W)',
      category: 'Fan & Motor Components',
      glb: 'assets/CadModels/electric_motor.glb',
      specs: {
        model: 'JHE-MTR-16W Shaded Pole Motor',
        temp: 'Class B Insulation (-30°C to +50°C)',
        compressor: '230V / 50Hz 1300 RPM 16W Output',
        steel: 'Die-Cast Aluminum + Copper Windings'
      },
      frames: [
        { minAngle: 315, maxAngle: 45, src: 'IMG/comp-motor.jpg', label: 'Front Drive Shaft (0°)' },
        { minAngle: 45, maxAngle: 135, src: 'IMG/comp-motor.jpg', label: 'Stator Cooling Fins (45°-90°)' },
        { minAngle: 135, maxAngle: 225, src: 'IMG/comp-motor.jpg', label: 'Terminal Leads & Rear Bearing (180°)' },
        { minAngle: 225, maxAngle: 315, src: 'IMG/comp-motor.jpg', label: 'Bracket Mounting Ring (270°)' }
      ],
      hotspots: [
        {
          id: 1,
          x: 50,
          y: 28,
          tag: 'Drive Spindle',
          title: 'Precision Ground Steel Shaft',
          desc: 'Hardened ground steel spindle with flat keyway for direct fan blade installation.'
        },
        {
          id: 2,
          x: 40,
          y: 55,
          tag: 'Copper Windings',
          title: '100% Electrolytic Copper Windings',
          desc: 'Vacuum-varnished dual-insulated copper coils engineered for continuous 24/7 duty.'
        },
        {
          id: 3,
          x: 62,
          y: 75,
          tag: 'Bearing Bush',
          title: 'Self-Aligning Porous Bronze Bearings',
          desc: 'Oil-impregnated sintered sleeve bearings providing silent operation and zero maintenance.'
        }
      ]
    },
    fan: {
      name: '10" Aluminum Condenser Fan (JHE-FAN-AL10)',
      category: 'Air Draft Components',
      glb: 'assets/CadModels/exhaust_fan.glb',
      specs: {
        model: 'JHE-FAN-AL10 10-Inch Fan Assembly',
        temp: 'High CFM Forced Draft (650 m³/h)',
        compressor: '5-Wing Aerodynamic High Pitch',
        steel: 'Stamped Aluminum Blades + Steel Hub'
      },
      frames: [
        { minAngle: 315, maxAngle: 45, src: 'IMG/comp-fan.jpg', label: 'Front Aerodynamic Face (0°)' },
        { minAngle: 45, maxAngle: 135, src: 'IMG/comp-fan.jpg', label: 'Blade Pitch Profile (45°-90°)' },
        { minAngle: 135, maxAngle: 225, src: 'IMG/comp-fan.jpg', label: 'Rear Hub & Shaft Collet (180°)' },
        { minAngle: 225, maxAngle: 315, src: 'IMG/comp-fan.jpg', label: 'Peripheral Air Induction Arc (270°)' }
      ],
      hotspots: [
        {
          id: 1,
          x: 50,
          y: 25,
          tag: 'Aero Blades',
          title: 'Dynamically Balanced Aluminum Wings',
          desc: 'Curved aerodynamic 5-blade profile engineered for maximum static air pressure and low acoustic dB.'
        },
        {
          id: 2,
          x: 50,
          y: 50,
          tag: 'Center Boss',
          title: 'Heavy-Gauge Zinc Steel Boss',
          desc: 'Corrosion-proof zinc-plated hub with Allen locking screw for vibration-free lock to shaft.'
        },
        {
          id: 3,
          x: 72,
          y: 65,
          tag: 'Heat Dissipation',
          title: 'Rapid Condenser Heat Extraction',
          desc: 'Directs uniform forced airflow across refrigeration condenser coils to prevent high-head cutouts.'
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
  let currentMode = 'turntable'; // 'turntable' or 'cad-3d'
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
  const cadCanvas = document.getElementById('cad-canvas');
  const cadModelViewer = document.getElementById('cad-model-viewer');
  const turntableContainer = document.getElementById('turntable-container');
  const dragHintText = document.getElementById('drag-hint-text');

  function initViewer() {
    if (!stage) return;

    setupEventListeners();
    renderProductHotspots();
    updateViewer(0);
    updateSpecsStrip('fridge');
    init3DCanvas();
    applyCurrentMode();
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

  function applyCurrentMode() {
    const product = PRODUCTS_DATA[currentProductId];
    const hasGlb = product && !!product.glb;

    if (currentMode === 'cad-3d') {
      // 3D CAD Mode Active
      if (turntableContainer) turntableContainer.style.display = 'none';
      if (hotspotsLayer) hotspotsLayer.style.display = 'none';

      if (hasGlb && cadModelViewer) {
        if (cadCanvas) cadCanvas.classList.remove('active');
        cadModelViewer.style.display = 'block';

        const targetSrc = product.glb;
        if (cadModelViewer.getAttribute('src') !== targetSrc) {
          cadModelViewer.src = targetSrc;
          cadModelViewer.alt = product.name;
        }

        cadModelViewer.cameraOrbit = `${currentAngle}deg 75deg auto`;
        cadModelViewer.autoRotate = isAutoRotate;

        if (dragHintText) {
          dragHintText.textContent = 'Drag in 3D to rotate, pitch & zoom model';
        }
      } else {
        // Fallback procedural CAD canvas
        if (cadModelViewer) cadModelViewer.style.display = 'none';
        if (cadCanvas) cadCanvas.classList.add('active');
        if (dragHintText) {
          dragHintText.textContent = 'Drag horizontally or scrub slider to rotate 3D wireframe';
        }
        if (window.jhe3dScene && window.jhe3dScene.render) {
          window.jhe3dScene.render();
        }
      }
    } else {
      // 360° Photo Turntable Mode Active
      if (cadModelViewer) {
        cadModelViewer.style.display = 'none';
        cadModelViewer.autoRotate = false;
      }
      if (cadCanvas) cadCanvas.classList.remove('active');
      if (turntableContainer) turntableContainer.style.display = 'flex';
      if (hotspotsLayer) hotspotsLayer.style.display = 'block';
      if (dragHintText) {
        dragHintText.textContent = 'Drag horizontally or scrub slider to rotate 360°';
      }
      updateViewer(currentAngle);
    }
  }

  function updateViewer(angle) {
    currentAngle = ((Math.round(angle) % 360) + 360) % 360;

    if (scrubber) scrubber.value = currentAngle;
    if (angleReadout) {
      angleReadout.textContent = `${String(currentAngle).padStart(3, '0')}°`;
    }

    presetButtons.forEach(btn => {
      const btnAngle = parseInt(btn.getAttribute('data-angle'), 10);
      btn.classList.toggle('active', Math.abs(currentAngle - btnAngle) <= 15);
    });

    const product = PRODUCTS_DATA[currentProductId];
    if (!product) return;

    // Sync camera orbit with 3D model viewer when active
    if (currentMode === 'cad-3d' && product.glb && cadModelViewer) {
      cadModelViewer.cameraOrbit = `${currentAngle}deg 75deg auto`;
    }

    // Sync procedural 3D canvas
    if (window.jhe3dScene && window.jhe3dScene.mesh) {
      window.jhe3dScene.mesh.rotation.y = (currentAngle * Math.PI) / 180;
    }

    // Turntable photo frame matching
    if (frameImg && product.frames && product.frames.length > 0) {
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
    // Stage drag handling for 360 Photo turntable
    stage.addEventListener('mousedown', (e) => {
      if (currentMode === 'cad-3d' && PRODUCTS_DATA[currentProductId]?.glb) return;
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

    let startY = 0;
    let isHorizontalGesture = false;

    stage.addEventListener('touchstart', (e) => {
      if (currentMode === 'cad-3d' && PRODUCTS_DATA[currentProductId]?.glb) return;
      if (e.target.closest('.hotspot-pin') || e.target.closest('button')) return;
      isDragging = true;
      isHorizontalGesture = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startAngle = currentAngle;
      stopAutoRotate();
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (!isHorizontalGesture) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 7) {
          isHorizontalGesture = true;
        } else if (Math.abs(dy) > 10) {
          isDragging = false;
          return;
        }
      }

      if (isHorizontalGesture) {
        const newAngle = startAngle + dx * 0.65;
        updateViewer(newAngle);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
      isHorizontalGesture = false;
    });

    // Model Viewer Camera Change Event (Bidirectional sync with slider)
    if (cadModelViewer) {
      cadModelViewer.addEventListener('camera-change', (event) => {
        if (event.detail && event.detail.source === 'user-interaction') {
          const orbit = cadModelViewer.getCameraOrbit();
          if (orbit && typeof orbit.theta === 'number') {
            let deg = Math.round((orbit.theta * 180) / Math.PI) % 360;
            if (deg < 0) deg += 360;
            currentAngle = deg;
            if (scrubber) scrubber.value = currentAngle;
            if (angleReadout) {
              angleReadout.textContent = `${String(currentAngle).padStart(3, '0')}°`;
            }
            presetButtons.forEach(btn => {
              const btnAngle = parseInt(btn.getAttribute('data-angle'), 10);
              btn.classList.toggle('active', Math.abs(currentAngle - btnAngle) <= 15);
            });
          }
        }
      });
    }

    // Scrubber Slider
    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        stopAutoRotate();
        updateViewer(parseFloat(e.target.value));
      });
    }

    // Angle Presets
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stopAutoRotate();
        const targetAngle = parseInt(btn.getAttribute('data-angle'), 10);
        animateToAngle(targetAngle);
        if (currentMode === 'cad-3d' && PRODUCTS_DATA[currentProductId]?.glb && cadModelViewer) {
          cadModelViewer.cameraOrbit = `${targetAngle}deg 75deg auto`;
        }
      });
    });

    // Product Selector Buttons
    productButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = btn.getAttribute('data-product');
        if (prod && PRODUCTS_DATA[prod]) {
          currentProductId = prod;
          productButtons.forEach(b => {
            const isActive = (b === btn);
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });
          renderProductHotspots();
          updateSpecsStrip(prod);
          applyCurrentMode();
          updateViewer(currentAngle);
        }
      });
    });

    // Mode Switcher Buttons (360° Photo vs 3D Model)
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (!mode) return;
        currentMode = mode;
        modeButtons.forEach(b => b.classList.toggle('active', b === btn));
        applyCurrentMode();
      });
    });

    // Auto-Rotate Button
    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        if (isAutoRotate) {
          stopAutoRotate();
        } else {
          startAutoRotate();
        }
      });
    }

    // Reset Angle Button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        stopAutoRotate();
        if (currentMode === 'cad-3d' && cadModelViewer) {
          cadModelViewer.cameraOrbit = '0deg 75deg auto';
          if (typeof cadModelViewer.resetTurntable === 'function') {
            cadModelViewer.resetTurntable();
          }
        }
        animateToAngle(0);
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

    if (currentMode === 'cad-3d' && PRODUCTS_DATA[currentProductId]?.glb && cadModelViewer) {
      cadModelViewer.autoRotate = true;
    }

    if (autoRotateInterval) clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
      if (currentMode === 'turntable' || !PRODUCTS_DATA[currentProductId]?.glb) {
        updateViewer(currentAngle + 1);
      }
    }, 40);
  }

  function stopAutoRotate() {
    isAutoRotate = false;
    if (autoRotateBtn) autoRotateBtn.classList.remove('active');

    if (cadModelViewer) {
      cadModelViewer.autoRotate = false;
    }

    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  // Procedural 3D Canvas Fallback Engine
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
      [4, 5, 6, 7, 'rgba(0, 113, 227, 0.25)'],
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
      if (currentMode !== 'cad-3d' || PRODUCTS_DATA[currentProductId]?.glb) return;

      const w = stage.clientWidth;
      const h = stage.clientHeight;
      ctx.clearRect(0, 0, w, h);

      rotY = (currentAngle * Math.PI) / 180;
      const projected = vertices.map(v => project(v, rotY));

      // Floor Grid
      ctx.strokeStyle = 'rgba(0, 113, 227, 0.15)';
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
          ctx.strokeStyle = '#2997ff';
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
        ctx.strokeStyle = isWireframe ? '#2997ff' : 'rgba(41, 151, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

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
