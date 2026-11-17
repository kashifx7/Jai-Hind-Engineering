/**
 * JAI HIND ENGINEERING WORKS - MAIN UI CONTROLLER
 * Handles:
 * - Compact scroll-hide / scroll-up reveal header
 * - Accessible mobile contact drawer
 * - Live components catalog search & native radio filtering
 * - Direct inquiry & Custom fabrication quote modal (<dialog> with light-dismiss fallback)
 * - Custom dimension estimator & component photo lightbox
 */

(function () {
  'use strict';

  const FACTORY_WHATSAPP = '919838021456';

  document.addEventListener('DOMContentLoaded', () => {
    initScrollHeader();
    initMobileDrawer();
    initPartsCatalog();
    initDirectInquiryForm();
    initQuoteModal();
    initDimensionCalculator();
    initLightbox();
  });

  // Shared helper: light-dismiss fallback for browsers lacking <dialog closedby="any">
  function attachDialogLightDismiss(dialog) {
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) {
        dialog.close();
      }
    });
  }

  // Shared helper: send formatted payload cleanly to WhatsApp
  function openWhatsAppInquiry(message) {
    const waUrl = `https://wa.me/${FACTORY_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  // =========================================================================
  // 1. COMPACT AUTO-HIDE HEADER ON SCROLL DOWN
  // =========================================================================
  function initScrollHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const currentY = Math.max(0, Math.min(window.scrollY, maxScroll));

        if (currentY !== lastY) {
          const isScrollingDown = currentY > lastY && currentY > header.offsetHeight;
          header.classList.toggle('is-hidden', isScrollingDown);
          lastY = currentY;
        }
        ticking = false;
      });
    }, { passive: true });
  }

  // =========================================================================
  // 2. ACCESSIBLE MOBILE CONTACT DRAWER
  // =========================================================================
  function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');

    if (!toggleBtn || !drawer || !backdrop) return;

    function setOpenState(open) {
      drawer.classList.toggle('open', open);
      backdrop.classList.toggle('active', open);
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';

      if (open && closeBtn) {
        closeBtn.focus();
      } else if (!open) {
        toggleBtn.focus();
      }
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpenState(!drawer.classList.contains('open'));
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => setOpenState(false));
    }

    backdrop.addEventListener('click', () => setOpenState(false));

    drawer.querySelectorAll('a, button:not(#drawer-close-btn)').forEach(el => {
      el.addEventListener('click', () => setOpenState(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        setOpenState(false);
      }
    });
  }

  // =========================================================================
  // 3. SIMILAR PRODUCTS & COMPONENTS CATALOG (SEARCH + RADIO FILTERS)
  // =========================================================================
  function initPartsCatalog() {
    const searchInput = document.getElementById('parts-search-input');
    const categoryRadios = document.querySelectorAll('input[name="parts-category"]');
    const partCards = document.querySelectorAll('.part-card');
    const countDisplay = document.getElementById('parts-count-num');

    if (!partCards.length) return;

    const checkedRadio = document.querySelector('input[name="parts-category"]:checked');
    let activeCategory = checkedRadio ? checkedRadio.value : 'all';
    let searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    function filterParts() {
      let visibleCount = 0;

      partCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardText = card.textContent.toLowerCase();

        const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
        const matchesSearch = (!searchQuery || cardText.includes(searchQuery));

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countDisplay) {
        countDisplay.textContent = visibleCount;
      }
    }

    // Apply initial filter state in case form controls were restored by browser
    filterParts();

    categoryRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          activeCategory = radio.value || 'all';
          filterParts();
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterParts();
      });
    }

    document.querySelectorAll('.inquire-part-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sku = btn.getAttribute('data-sku') || '';
        const name = btn.getAttribute('data-name') || '';
        openQuoteModalWithPart(sku, name);
      });
    });

    // Touch tap fallback toggle for revealing specs smoothly without interfering with actions
    partCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('img')) return;
        const wasActive = card.classList.contains('is-active');
        partCards.forEach(c => c.classList.remove('is-active'));
        if (!wasActive) {
          card.classList.add('is-active');
        }
      });
    });
  }

  // =========================================================================
  // 4. DIRECT FACTORY CONTACT FORM (#main-inquiry-form)
  // =========================================================================
  function initDirectInquiryForm() {
    const form = document.getElementById('main-inquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim() || '';
      const phone = document.getElementById('contact-phone')?.value.trim() || '';
      const product = document.getElementById('contact-product')?.value || '';
      const city = document.getElementById('contact-city')?.value.trim() || '';
      const message = document.getElementById('contact-message')?.value.trim() || '';

      const payload =
        `*DIRECT INQUIRY: JAI HIND ENGINEERING WORKS*\n` +
        `-----------------------------------------\n` +
        `*Client / Business:* ${name}\n` +
        `*Phone Number:* ${phone}\n` +
        `*Product Category:* ${product}\n` +
        `*Delivery City:* ${city}\n` +
        (message ? `*Requirements:* ${message}\n` : '') +
        `-----------------------------------------\n` +
        `Sent from Workshop Website`;

      openWhatsAppInquiry(payload);
    });
  }

  // =========================================================================
  // 5. CUSTOM QUOTE MODAL (<dialog>)
  // =========================================================================
  const quoteDialog = document.getElementById('quote-modal');
  const quoteForm = document.getElementById('quote-form');

  function setProductSelectValue(select, productType) {
    if (!select || !productType) return;
    for (const opt of select.options) {
      if (opt.value === productType || productType.includes(opt.value)) {
        select.value = opt.value;
        return;
      }
    }
    select.value = 'Complete Factory Custom Unit';
  }

  function initQuoteModal() {
    if (!quoteDialog) return;

    document.querySelectorAll('.open-quote-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productType = btn.getAttribute('data-product-type');
        setProductSelectValue(document.getElementById('quote-product-type'), productType);
        quoteDialog.showModal();
      });
    });

    const closeBtn = document.getElementById('close-quote-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => quoteDialog.close());
    }

    attachDialogLightDismiss(quoteDialog);

    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('quote-name')?.value.trim() || '';
        const phone = document.getElementById('quote-phone')?.value.trim() || '';
        const location = document.getElementById('quote-location')?.value.trim() || '';
        const product = document.getElementById('quote-product-type')?.value || '';
        const dimensions = document.getElementById('quote-dimensions')?.value.trim() || 'Standard';
        const material = document.getElementById('quote-material')?.value || 'SS-304';
        const notes = document.getElementById('quote-notes')?.value.trim() || '';

        const message =
          `*CUSTOM QUOTE REQUEST: JAI HIND ENGINEERING WORKS*\n` +
          `-----------------------------------\n` +
          `*Client / Business:* ${name}\n` +
          `*Phone:* ${phone}\n` +
          `*Delivery City:* ${location}\n` +
          `*Product Line:* ${product}\n` +
          `*Dimensions:* ${dimensions}\n` +
          `*Steel Grade:* ${material}\n` +
          (notes ? `*Notes / Part SKU:* ${notes}\n` : '') +
          `-----------------------------------\n` +
          `Sent from Workshop Quote Desk`;

        openWhatsAppInquiry(message);
        quoteDialog.close();
      });
    }
  }

  function openQuoteModalWithPart(sku, name) {
    if (!quoteDialog) return;

    const select = document.getElementById('quote-product-type');
    const notes = document.getElementById('quote-notes');

    if (select) select.value = 'Hardware Spare Parts (Motors / Trays / Gas)';
    if (notes) {
      notes.value = `Inquiring for Spare Part: ${name} (SKU: ${sku}). Please share wholesale pricing and dispatch availability.`;
    }

    quoteDialog.showModal();
  }

  // =========================================================================
  // 6. DIMENSION ESTIMATOR INSIDE QUOTE MODAL
  // =========================================================================
  function initDimensionCalculator() {
    const lenInput = document.getElementById('calc-length');
    const widthInput = document.getElementById('calc-width');
    const heightInput = document.getElementById('calc-height');
    const calcOutput = document.getElementById('calculator-result-text');
    const summaryInput = document.getElementById('quote-dimensions');

    if (!lenInput || !widthInput || !heightInput || !calcOutput) return;

    function recalculate() {
      const l = parseFloat(lenInput.value) || 0;
      const w = parseFloat(widthInput.value) || 0;
      const h = parseFloat(heightInput.value) || 0;

      if (l > 0 && w > 0 && h > 0) {
        const cft = ((l * w * h) / 1728).toFixed(1);
        const liters = (cft * 28.3168).toFixed(0);
        const runningFeet = (l / 12).toFixed(1);

        calcOutput.innerHTML = `Estimated Spec: Approx <strong>${liters} Liters</strong> (${cft} CFT) &bull; <strong>${runningFeet} ft</strong> running length.`;

        if (summaryInput && (!summaryInput.value || summaryInput.dataset.autoFilled === 'true')) {
          summaryInput.value = `${l}"L x ${w}"W x ${h}"H (${runningFeet} ft / ${liters}L)`;
          summaryInput.dataset.autoFilled = 'true';
        }
      } else {
        calcOutput.textContent = 'Enter dimensions in inches to estimate interior volume & running feet.';
      }
    }

    if (summaryInput) {
      summaryInput.addEventListener('input', () => {
        summaryInput.dataset.autoFilled = 'false';
      });
    }

    lenInput.addEventListener('input', recalculate);
    widthInput.addEventListener('input', recalculate);
    heightInput.addEventListener('input', recalculate);
  }

  // =========================================================================
  // 7. COMPONENT IMAGE LIGHTBOX (<dialog>)
  // =========================================================================
  function initLightbox() {
    const zoomableImages = document.querySelectorAll('.part-media img');
    const lightboxDialog = document.getElementById('lightbox-dialog');
    const lightboxImg = document.getElementById('lightbox-image');
    const closeBtn = document.getElementById('close-lightbox-btn');

    if (!lightboxDialog || !lightboxImg) return;

    zoomableImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Component enlarged preview';
        lightboxDialog.showModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => lightboxDialog.close());
    }

    attachDialogLightDismiss(lightboxDialog);
  }
})();
