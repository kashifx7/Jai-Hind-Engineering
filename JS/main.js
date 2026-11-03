/**
 * JAI HIND ENGINEERING WORKS - MAIN CONTROLLER
 * Handles:
 * - Live Parts & Hardware Catalog Search & Category Filters
 * - Quotation Modal (<dialog>) with Dimension Calculator & WhatsApp Generator
 * - Mobile Navigation Drawer
 * - Intersection Observer Active Scroll Links
 * - Image Lightbox Viewer
 */

(function () {
  'use strict';

  // Factory WhatsApp Contact Number (for direct B2B inquiries)
  const FACTORY_WHATSAPP = '919838021456';

  // Wait for DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initPartsCatalog();
    initQuoteModal();
    initMobileNav();
    initScrollSpy();
    initLightbox();
    initDimensionCalculator();
  });

  // =========================================================================
  // 1. PARTS & HARDWARE CATALOG (LIVE SEARCH & FILTER)
  // =========================================================================
  function initPartsCatalog() {
    const searchInput = document.getElementById('parts-search-input');
    const categoryPills = document.querySelectorAll('.category-pill');
    const partCards = document.querySelectorAll('.part-card');
    const countDisplay = document.getElementById('parts-count-num');

    if (!partCards.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

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
      });
    });

    // Search Input Typing
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterParts();
      });
    }

    // "Inquire Part" Button Clicks on Cards
    document.querySelectorAll('.inquire-part-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sku = btn.getAttribute('data-sku') || '';
        const name = btn.getAttribute('data-name') || '';

        // Open Quote Modal with pre-filled details
        openQuoteModalWithPart(sku, name);
      });
    });
  }

  // =========================================================================
  // 2. QUOTE & CUSTOM FABRICATION MODAL (<dialog>)
  // =========================================================================
  const quoteDialog = document.getElementById('quote-modal');
  const quoteForm = document.getElementById('quote-form');

  function initQuoteModal() {
    if (!quoteDialog) return;

    // Open triggers across the page
    document.querySelectorAll('.open-quote-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productType = btn.getAttribute('data-product-type');
        if (productType) {
          const select = document.getElementById('quote-product-type');
          if (select) select.value = productType;
        }
        quoteDialog.showModal();
      });
    });

    // Close Button
    const closeBtn = document.getElementById('close-quote-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        quoteDialog.close();
      });
    }

    // Light-Dismiss on Backdrop Click
    quoteDialog.addEventListener('click', (e) => {
      const dialogDimensions = quoteDialog.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        quoteDialog.close();
      }
    });

    // Form Submit -> WhatsApp Formatter
    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('quote-name')?.value || '';
        const phone = document.getElementById('quote-phone')?.value || '';
        const location = document.getElementById('quote-location')?.value || '';
        const product = document.getElementById('quote-product-type')?.value || '';
        const dimensions = document.getElementById('quote-dimensions')?.value || 'Standard';
        const material = document.getElementById('quote-material')?.value || 'SS-304';
        const notes = document.getElementById('quote-notes')?.value || '';

        // Build WhatsApp text message
        const message = `*INQUIRY: JAI HIND ENGINEERING WORKS*\n` +
          `-----------------------------------\n` +
          `*Client Name:* ${name}\n` +
          `*Phone:* ${phone}\n` +
          `*Delivery City:* ${location}\n` +
          `*Product Required:* ${product}\n` +
          `*Required Dimensions:* ${dimensions}\n` +
          `*Grade:* ${material}\n` +
          (notes ? `*Custom Notes:* ${notes}\n` : '') +
          `-----------------------------------\n` +
          `Sent from Official Factory Web Portal`;

        const encodedMsg = encodeURIComponent(message);
        const waUrl = `https://wa.me/${FACTORY_WHATSAPP}?text=${encodedMsg}`;

        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');
        quoteDialog.close();
      });
    }
  }

  function openQuoteModalWithPart(sku, name) {
    if (!quoteDialog) return;

    const select = document.getElementById('quote-product-type');
    const notes = document.getElementById('quote-notes');

    if (select) select.value = 'Spare Parts / Hardware';
    if (notes) {
      notes.value = `Inquiring for Spare Part: ${name} (SKU: ${sku}). Please share wholesale pricing & delivery availability.`;
    }

    quoteDialog.showModal();
  }

  // =========================================================================
  // 3. DIMENSION CALCULATOR FOR CUSTOM FABRICATIONS
  // =========================================================================
  function initDimensionCalculator() {
    const lenInput = document.getElementById('calc-length');
    const widthInput = document.getElementById('calc-width');
    const heightInput = document.getElementById('calc-height');
    const calcOutput = document.getElementById('calculator-result-text');

    if (!lenInput || !widthInput || !heightInput || !calcOutput) return;

    function recalculate() {
      const l = parseFloat(lenInput.value) || 0;
      const w = parseFloat(widthInput.value) || 0;
      const h = parseFloat(heightInput.value) || 0;

      if (l > 0 && w > 0 && h > 0) {
        // Cubic feet calculation
        const cft = ((l * w * h) / 1728).toFixed(1);
        const liters = (cft * 28.3168).toFixed(0);
        const runningFeet = (l / 12).toFixed(1);

        calcOutput.innerHTML = `<strong>Estimated Spec:</strong> Approx <strong>${liters} Liters</strong> (${cft} CFT) volume • <strong>${runningFeet} ft</strong> running display length. In-house tooling available for this sizing.`;
      } else {
        calcOutput.innerHTML = `Enter dimensions in inches to calculate estimated storage volume & running feet.`;
      }
    }

    lenInput.addEventListener('input', recalculate);
    widthInput.addEventListener('input', recalculate);
    heightInput.addEventListener('input', recalculate);
  }

  // =========================================================================
  // 4. MOBILE NAVIGATION DRAWER
  // =========================================================================
  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (!toggleBtn || !mainNav) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on clicking any link
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !toggleBtn.contains(e.target)) {
        mainNav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 5. SCROLLSPY (ACTIVE NAV HIGHLIGHT)
  // =========================================================================
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id], div[id].section-padding');
    const navLinks = document.querySelectorAll('.nav-link');

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
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // =========================================================================
  // 6. IMAGE LIGHTBOX (ZOOM IN INSPECTION)
  // =========================================================================
  function initLightbox() {
    const zoomableImages = document.querySelectorAll('.product-media-container img, .icecream-thumb img');
    const lightboxDialog = document.getElementById('lightbox-dialog');
    const lightboxImg = document.getElementById('lightbox-image');

    if (!lightboxDialog || !lightboxImg) return;

    zoomableImages.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Inspection View';
        lightboxDialog.showModal();
      });
    });

    lightboxDialog.addEventListener('click', () => {
      lightboxDialog.close();
    });
  }

})();
