/**
 * JAI HIND ENGINEERING WORKS - 3D INTERACTIVE PRODUCT STUDIO
 * Features:
 * - Real-time 3D GLB Model Rendering via Google <model-viewer>
 * - Interactive 3D Product Switching (Fridge, Ice Cream Machine, Compressor, Motor, Fan)
 * - Bi-directional Synchronization between 3D Camera Orbit and Angle Scrubber
 * - Camera Angle Presets (Front 0°, Quarter 45°, Side 90°, Back 180°)
 * - Auto-Rotate & One-Click Camera Reset
 * - Augmented Reality (AR) Quick Look / Scene Viewer Launch
 * - Dynamic Technical Specifications & Factory Quote Linking
 */

(function () {
  'use strict';

  // 3D Model Configurations and Technical Specifications
  const PRODUCTS_DATA = {
    fridge: {
      name: 'Commercial Fridge (JHE-CR-450)',
      glb: 'assets/CadModels/fridge.glb',
      specs: {
        model: 'Commercial Fridge (JHE-CR-450)',
        temp: '+1°C to +8°C Uniform Chilling',
        compressor: 'Embraco Aspera Tropical 1/4 HP',
        steel: '1.2mm Food-Grade SS-304'
      }
    },
    icecream: {
      name: 'Ice Cream Machine (JHE-IC-320)',
      glb: 'assets/CadModels/icecreammachine.glb',
      specs: {
        model: 'Ice Cream Machine (JHE-IC-320)',
        temp: '-8°C Rapid Freezing Well',
        compressor: 'Twin Cryogenic R-404A Engine',
        steel: 'Dual SS-304 Freezing Cylinders'
      }
    },
    compressor: {
      name: 'Compressor (JHE-CMP-EM65)',
      glb: 'assets/CadModels/compressor.glb',
      specs: {
        model: 'Compressor (JHE-CMP-EM65)',
        temp: '-10°C to +7.2°C Evaporating',
        compressor: 'Embraco 1/4 HP Tropical R-134a',
        steel: 'Coated Hermetic Steel Shell'
      }
    },
    motor: {
      name: 'Electric Motor (JHE-MTR-16W)',
      glb: 'assets/CadModels/electric_motor.glb',
      specs: {
        model: 'Electric Motor (JHE-MTR-16W)',
        temp: 'Class B Insulation (-30°C to +50°C)',
        compressor: '230V / 50Hz 1300 RPM 16W Output',
        steel: 'Die-Cast Aluminum + Copper Windings'
      }
    },
    fan: {
      name: 'Exhaust Fan (JHE-FAN-AL10)',
      glb: 'assets/CadModels/exhaust_fan.glb',
      specs: {
        model: 'Exhaust Fan (JHE-FAN-AL10)',
        temp: 'High CFM Forced Draft (650 m³/h)',
        compressor: '5-Wing Aerodynamic Pitch',
        steel: 'Stamped Aluminum Blades + Steel Hub'
      }
    }
  };

  // State
  let currentProductId = 'fridge';
  let currentAngle = 0; // 0 to 359 degrees
  let isAutoRotate = true; // Auto-rotate on by default for lively 3D showcase
  let isProgrammaticOrbit = false;

  // DOM Elements
  const stage = document.getElementById('viewer-stage');
  const cadModelViewer = document.getElementById('cad-model-viewer');
  const scrubber = document.getElementById('angle-slider');
  const angleReadout = document.getElementById('angle-readout');
  const productButtons = document.querySelectorAll('.viewer-product-btn');
  const presetButtons = document.querySelectorAll('.preset-btn');
  const autoRotateBtn = document.getElementById('auto-rotate-btn');
  const resetBtn = document.getElementById('reset-view-btn');
  const arBtn = document.getElementById('trigger-ar-btn');

  function initViewer() {
    if (!cadModelViewer) return;

    setupEventListeners();
    updateSpecsStrip('fridge');
    loadProductModel('fridge');

    if (autoRotateBtn) {
      autoRotateBtn.classList.toggle('active', isAutoRotate);
    }
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

  function loadProductModel(productId) {
    const data = PRODUCTS_DATA[productId];
    if (!data || !cadModelViewer) return;

    currentProductId = productId;

    // Switch model source smoothly
    if (cadModelViewer.getAttribute('src') !== data.glb) {
      cadModelViewer.src = data.glb;
      cadModelViewer.alt = `Interactive 3D model - ${data.name}`;
    }

    // Reset camera orbit to front view on product switch
    setCameraAngle(0);
    cadModelViewer.autoRotate = isAutoRotate;
  }

  function setCameraAngle(angle) {
    currentAngle = ((Math.round(angle) % 360) + 360) % 360;

    if (scrubber) scrubber.value = currentAngle;
    if (angleReadout) {
      angleReadout.textContent = `${String(currentAngle).padStart(3, '0')}°`;
    }

    // Update active preset button
    presetButtons.forEach(btn => {
      const btnAngle = parseInt(btn.getAttribute('data-angle'), 10);
      btn.classList.toggle('active', Math.abs(currentAngle - btnAngle) <= 15);
    });

    // Apply orbit to 3D model
    if (cadModelViewer) {
      isProgrammaticOrbit = true;
      cadModelViewer.cameraOrbit = `${currentAngle}deg 75deg auto`;
      // Allow user interaction events after orbit finishes applying
      setTimeout(() => {
        isProgrammaticOrbit = false;
      }, 50);
    }
  }

  function setupEventListeners() {
    // 1. Bi-directional sync: Direct 3D Model drag -> updates scrubber & readout
    if (cadModelViewer) {
      cadModelViewer.addEventListener('camera-change', (event) => {
        if (isProgrammaticOrbit) return;

        // Sync when user drags or model rotates
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
      });
    }

    // 2. Angle Scrubber Slider
    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        setCameraAngle(val);
      });
    }

    // 3. Angle Presets (Front 0°, Quarter 45°, Side 90°, Back 180°)
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetAngle = parseInt(btn.getAttribute('data-angle'), 10);
        animateToAngle(targetAngle);
      });
    });

    // 4. Product Selector Buttons
    productButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = btn.getAttribute('data-product');
        if (prod && PRODUCTS_DATA[prod]) {
          productButtons.forEach(b => {
            const isActive = (b === btn);
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });

          updateSpecsStrip(prod);
          loadProductModel(prod);
        }
      });
    });

    // 5. Auto-Rotate Toggle Button
    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        isAutoRotate = !isAutoRotate;
        autoRotateBtn.classList.toggle('active', isAutoRotate);
        if (cadModelViewer) {
          cadModelViewer.autoRotate = isAutoRotate;
        }
      });
    }

    // 6. Reset Camera View Button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (cadModelViewer) {
          if (typeof cadModelViewer.resetTurntable === 'function') {
            cadModelViewer.resetTurntable();
          }
        }
        animateToAngle(0);
      });
    }

    // 7. AR View in Room Button (Mobile Augmented Reality)
    if (arBtn && cadModelViewer) {
      arBtn.addEventListener('click', () => {
        if (typeof cadModelViewer.activateAR === 'function') {
          cadModelViewer.activateAR();
        }
      });
    }
  }

  // Smooth animation helper between angles
  function animateToAngle(targetAngle) {
    const start = currentAngle;
    let diff = (targetAngle - start) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const startTime = performance.now();
    const duration = 350;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCameraAngle(start + diff * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewer);
  } else {
    initViewer();
  }

})();
