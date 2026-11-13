/**
 * JAI HIND ENGINEERING WORKS - 3D EQUIPMENT STUDIO CONTROLLER
 * Real-Time 3D CAD Mesh Rendering via Google <model-viewer>
 * Features:
 * - 5 Verified GLB 3D Models (Commercial Fridge, Ice Cream Machine, Compressor, Motor, Exhaust Fan)
 * - Bi-directional 360° Orbit & Angle Scrubber Synchronization
 * - Precision View Presets (0° Front, 45° Quarter, 90° Side, 180° Back)
 * - Auto-Rotate & Camera Reset Controls
 * - WebXR / QuickLook Augmented Reality (AR) Activation
 * - Dynamic Engineering Specs Strip & Inquiry Linkage
 */

(function () {
  'use strict';

  // 5 Real 3D CAD Equipment Models & Engineering Specs
  const PRODUCTS_DATA = {
    fridge: {
      name: 'Commercial Fridge (JHE-CR-450)',
      glbSrc: 'assets/CadModels/fridge.glb',
      specs: {
        model: 'JHE-CR-450 Commercial Visi-Cooler',
        temp: '+1°C to +8°C Uniform Chilling',
        compressor: 'Embraco Aspera 1/4 HP Tropical',
        steel: '1.2mm SS-304 & Double Glazed Glass'
      }
    },
    icecream: {
      name: 'Ice Cream Machine (JHE-IC-320)',
      glbSrc: 'assets/CadModels/icecreammachine.glb',
      specs: {
        model: 'JHE-IC-320 Soft Serve Dispenser',
        temp: '-8°C Rapid Freezing Wells',
        compressor: 'Twin Cryogenic R-404A Engine',
        steel: 'Dual SS-304 Wells & Chrome Levers'
      }
    },
    compressor: {
      name: 'Compressor (JHE-CMP-EM65)',
      glbSrc: 'assets/CadModels/compressor.glb',
      specs: {
        model: 'JHE-CMP-EM65 Hermetic Reciprocating',
        temp: 'Sub-Zero LBP / MBP High Back Pressure',
        compressor: '1/4 HP • 230V 50Hz • Tropical 48°C',
        steel: 'Cast Steel Chassis & Copper Winding'
      }
    },
    motor: {
      name: 'Electric Motor (JHE-MTR-16W)',
      glbSrc: 'assets/CadModels/electric_motor.glb',
      specs: {
        model: 'JHE-MTR-16W Shaded Pole Motor',
        temp: '-30°C to +50°C Thermal Rating',
        compressor: '16W High Output • 1300 RPM',
        steel: 'IP42 Sealed Enclosure • Ball Bearing'
      }
    },
    fan: {
      name: 'Exhaust Fan (JHE-FAN-AL10)',
      glbSrc: 'assets/CadModels/exhaust_fan.glb',
      specs: {
        model: 'JHE-FAN-AL10 Aerodynamic Fan Blade',
        temp: 'High CFM Condenser Heat Dissipation',
        compressor: '254mm (10-Inch) Outer Span',
        steel: 'Cast Aluminum Alloy • Zero Vibration'
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    init3DStudio();
  });

  function init3DStudio() {
    const viewer = document.getElementById('cad-model-viewer');
    const productBtns = document.querySelectorAll('.viewer-product-btn');
    const angleSlider = document.getElementById('angle-slider');
    const angleReadout = document.getElementById('angle-readout');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const autoRotateBtn = document.getElementById('auto-rotate-btn');
    const resetViewBtn = document.getElementById('reset-view-btn');
    const arBtn = document.getElementById('trigger-ar-btn');
    const dragHint = document.getElementById('drag-hint-pill');

    const specModel = document.getElementById('spec-val-model');
    const specTemp = document.getElementById('spec-val-temp');
    const specComp = document.getElementById('spec-val-comp');
    const specSteel = document.getElementById('spec-val-steel');
    const specQuoteBtn = document.getElementById('spec-quote-btn');

    if (!viewer) return;

    let currentProductKey = 'fridge';
    let isUserScrubbing = false;
    let hasInteracted = false;

    // =========================================================================
    // 1. PRODUCT SWITCHING
    // =========================================================================
    function switchProduct(productKey) {
      const data = PRODUCTS_DATA[productKey];
      if (!data) return;

      currentProductKey = productKey;

      // Update 3D Model Source & Accessibility
      viewer.src = data.glbSrc;
      viewer.alt = `Interactive 3D model - ${data.name}`;

      // Update Live Specs Strip
      if (specModel) specModel.textContent = data.specs.model;
      if (specTemp) specTemp.textContent = data.specs.temp;
      if (specComp) specComp.textContent = data.specs.compressor;
      if (specSteel) specSteel.textContent = data.specs.steel;

      // Update Quote Button Context
      if (specQuoteBtn) {
        specQuoteBtn.setAttribute('data-product-type', data.name);
      }

      // Reset Camera to Front 0°
      resetCameraView();

      // Update Product Buttons UI
      productBtns.forEach(btn => {
        const isActive = btn.getAttribute('data-product') === productKey;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    productBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-product');
        if (key && key !== currentProductKey) {
          switchProduct(key);
        }
      });
    });

    // =========================================================================
    // 2. CAMERA ANGLE & SCRUBBER SYNCHRONIZATION
    // =========================================================================
    function updateAngleDisplay(deg) {
      if (angleSlider) angleSlider.value = deg;
      if (angleReadout) angleReadout.textContent = String(deg).padStart(3, '0') + '°';

      // Highlight matching preset button
      presetBtns.forEach(btn => {
        const presetAngle = parseInt(btn.getAttribute('data-angle'), 10);
        const isMatch = Math.abs(presetAngle - deg) <= 5 || (presetAngle === 0 && deg >= 355);
        btn.classList.toggle('active', isMatch);
      });
    }

    // Listen to real-time camera changes from model-viewer
    viewer.addEventListener('camera-change', () => {
      if (isUserScrubbing) return;

      try {
        const orbit = viewer.getCameraOrbit();
        if (orbit && typeof orbit.theta === 'number') {
          const thetaDeg = Math.round(((orbit.theta * 180 / Math.PI) % 360 + 360) % 360);
          updateAngleDisplay(thetaDeg);
        }
      } catch (e) {
        // Fallback for browsers with strict custom element timing
      }
    });

    // Angle Scrubber Input Slider
    if (angleSlider) {
      angleSlider.addEventListener('input', (e) => {
        isUserScrubbing = true;
        const targetDeg = parseInt(e.target.value, 10);
        updateAngleDisplay(targetDeg);

        // Turn off auto-rotate when user manual-scrubs
        if (viewer.autoRotate) {
          viewer.autoRotate = false;
          if (autoRotateBtn) autoRotateBtn.classList.remove('active');
        }

        // Apply orbit theta while keeping natural elevation and radius
        viewer.cameraOrbit = `${targetDeg}deg 75deg auto`;
      });

      angleSlider.addEventListener('change', () => {
        isUserScrubbing = false;
      });
    }

    // Preset Angle Buttons (0°, 45°, 90°, 180°)
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetDeg = parseInt(btn.getAttribute('data-angle'), 10);
        updateAngleDisplay(targetDeg);

        // Disable auto-rotate
        if (viewer.autoRotate) {
          viewer.autoRotate = false;
          if (autoRotateBtn) autoRotateBtn.classList.remove('active');
        }

        viewer.cameraOrbit = `${targetDeg}deg 75deg auto`;
      });
    });

    // =========================================================================
    // 3. AUXILIARY CONTROLS (AUTO-ROTATE, RESET, AR)
    // =========================================================================
    function resetCameraView() {
      viewer.cameraOrbit = '0deg 75deg auto';
      viewer.fieldOfView = 'auto';
      viewer.cameraTarget = 'auto auto auto';
      updateAngleDisplay(0);
    }

    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => {
        resetCameraView();
      });
    }

    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        viewer.autoRotate = !viewer.autoRotate;
        autoRotateBtn.classList.toggle('active', viewer.autoRotate);
      });
    }

    if (arBtn) {
      arBtn.addEventListener('click', () => {
        if (viewer.canActivateAR) {
          viewer.activateAR();
        } else {
          // Helpful user notification for desktop / unsupported environments
          alert('Augmented Reality (AR) 3D placement requires an ARCore (Android) or ARKit (iPhone / iPad) mobile device with camera access. On mobile, tap "View in Room" to place this equipment directly on your factory or shop floor!');
        }
      });
    }

    // Dismiss drag hint pill upon first interaction
    function dismissHint() {
      if (!hasInteracted && dragHint) {
        hasInteracted = true;
        dragHint.style.opacity = '0';
        setTimeout(() => {
          dragHint.style.display = 'none';
        }, 500);
      }
    }

    viewer.addEventListener('mousedown', dismissHint, { once: true });
    viewer.addEventListener('touchstart', dismissHint, { once: true });
    viewer.addEventListener('wheel', dismissHint, { once: true });
  }
})();
