/**
 * JAI HIND ENGINEERING WORKS - MAIN UI CONTROLLER
 * Handles:
 * - Mobile Navigation Drawer & Backdrop Focus
 * - Scroll-down Hide / Scroll-up Show Navbar (Modern Web Guidance)
 * - Direct Factory WhatsApp Inquiry Form
 * - Live Parts & Hardware Catalog Search & Category Filters
 * - Quotation Modal (<dialog>) with Custom Dimension Calculator
 * - Intersection Observer Active Scroll Links
 * - Image Lightbox Viewer
 */

(function () {
  'use strict';

  const FACTORY_WHATSAPP = '919838021456';

  document.addEventListener('DOMContentLoaded', () => {
    initScrollHeader();
    initMobileNav();
    initDirectInquiryForm();
    initPartsCatalog();
    initDirectInquiryForm();
    initQuoteModal();
    initScrollSpy();
    initLightbox();
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
      drawer.inert = !open;
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
  // 1. SCROLL-DOWN HIDE / SCROLL-UP SHOW HEADER (Modern Web Guidance)
  // Maximize content reading area and eliminate noise on mobile
  // =========================================================================
  function initScrollHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Clamp so rubber-band overscroll at top/bottom doesn't flip direction
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const currentY = Math.max(0, Math.min(window.scrollY, maxScroll));

          const drawerOpen = document.querySelector('.mobile-drawer.open');
          const isModalOpen = document.querySelector('dialog[open]');

          // Do not hide header if mobile drawer or dialog modal is open
          if (!drawerOpen && !isModalOpen) {
            if (currentY > lastY && currentY > 70) {
              // Scrolling DOWN: hide header
              header.classList.add('header-hidden');
            } else if (currentY < lastY || currentY <= 30) {
              // Scrolling UP or at top: reveal header
              header.classList.remove('header-hidden');
            }
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // =========================================================================
  // 2. ACCESSIBLE MOBILE NAVIGATION DRAWER
  // =========================================================================
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');

    if (!toggleBtn || !drawer || !backdrop) return;

    function openDrawer() {
      drawer.classList.add('open');
      backdrop.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scroll on mobile
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    backdrop.addEventListener('click', closeDrawer);

    // Close on clicking any link or action inside drawer
    drawer.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // =========================================================================
  // 3. DIRECT ON-PAGE FACTORY INQUIRY FORM
  // Sends inquiry directly to WhatsApp with prefilled message
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

      const waText =
        `*DIRECT INQUIRY: JAI HIND ENGINEERING WORKS*\n` +
        `-----------------------------------------\n` +
        `*Client/Business:* ${name}\n` +
        `*Phone Number:* ${phone}\n` +
        `*Product Category:* ${product}\n` +
        `*Delivery City:* ${city}\n` +
        (message ? `*Requirements/Dimensions:* ${message}\n` : '') +
        `-----------------------------------------\n` +
        `Sent from Official Factory Web Portal`;

      const encoded = encodeURIComponent(waText);
      const waUrl = `https://wa.me/${FACTORY_WHATSAPP}?text=${encoded}`;

      window.open(waUrl, '_blank');
    });
  }

  // =========================================================================
  // 4. PARTS & HARDWARE CATALOG (LIVE SEARCH & FILTER)
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

    // Category Pill Click
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category') || 'all';
        filterParts();

        // Scroll pill into view smoothly on mobile
        pill.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
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

    // Tap card on touch screens to reveal/toggle specs cleanly
    partCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.part-btn')) return;
        const wasActive = card.classList.contains('is-active');
        partCards.forEach(c => c.classList.remove('is-active'));
        if (!wasActive) {
          card.classList.add('is-active');
        }
      });
    });
  }

  // =========================================================================
  // 5. QUOTE & CUSTOM FABRICATION MODAL (<dialog>)
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
        if (productType) {
          const select = document.getElementById('quote-product-type');
          if (select) {
            // Find option matching or fallback
            let found = false;
            for (let opt of select.options) {
              if (opt.value === productType || productType.includes(opt.value)) {
                select.value = opt.value;
                found = true;
                break;
              }
            }
            if (!found) {
              select.value = 'Complete Factory Custom Unit';
            }
          }
        }
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

        // Build WhatsApp text message
        const message =
          `*CUSTOM FABRICATION QUOTE REQUEST*\n` +
          `*Jai Hind Engineering Works*\n` +
          `-----------------------------------\n` +
          `*Client Name:* ${name}\n` +
          `*Phone Number:* ${phone}\n` +
          `*Delivery City:* ${location}\n` +
          `*Equipment Required:* ${product}\n` +
          `*Dimensions / Sizing:* ${dimensions}\n` +
          `*Steel Grade:* ${material}\n` +
          (notes ? `*Custom Notes:* ${notes}\n` : '') +
          `-----------------------------------\n` +
          `Transmitted from Official Web Portal`;

        const encodedMsg = encodeURIComponent(message);
        const waUrl = `https://wa.me/${FACTORY_WHATSAPP}?text=${encodedMsg}`;

        window.open(waUrl, '_blank');
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
  // 6. DIMENSION CALCULATOR FOR CUSTOM FABRICATIONS
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

        calcOutput.innerHTML = `<strong>Estimated Spec:</strong> Approx <strong>${liters} Liters</strong> (${cft} CFT) volume • <strong>${runningFeet} ft</strong> running display length. In-house tooling available for this custom size.`;

        if (summaryInput && (!summaryInput.value || summaryInput.value.includes('in /'))) {
          summaryInput.value = `${l}"L × ${w}"W × ${h}"H (${runningFeet} ft / ${liters}L)`;
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
  // 7. SCROLLSPY (ACTIVE NAV HIGHLIGHT)
  // =========================================================================
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .drawer-nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // =========================================================================
  // 8. IMAGE LIGHTBOX (ZOOM IN INSPECTION)
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
