/* ============================================================
   JRII.DEV — Monochrome Engineering Manifesto
   Vanilla ES6 · 60fps · Null-safe
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ——————————————————————————————————————————————
     0. MOBILE NAV TOGGLE
     —————————————————————————————————————————————— */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }


  /* ——————————————————————————————————————————————
     1. MULTI-DEPTH 3D CURSOR PARALLAX TILT
     —————————————————————————————————————————————— */
  const heroArea = document.querySelector('.hero-centerpiece');
  const heroImgs = document.querySelectorAll('.hero-3d-img');

  if (heroArea && heroImgs.length) {
    const MAX_TILT = 12;
    const LERP = 0.06;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let active = false, rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    function applyTransforms() {
      heroImgs.forEach(img => {
        const depth = parseFloat(img.dataset.depth) || 1;
        const rx = currentX * depth;
        const ry = currentY * depth;
        const tx = currentY * depth * 1.2;
        const ty = -currentX * depth * 1.2;
        img.style.transform =
          `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translate3d(${tx.toFixed(3)}px, ${ty.toFixed(3)}px, 0)`;
      });
    }

    function resetTransforms() {
      heroImgs.forEach(img => {
        img.style.transform = '';
      });
    }

    function clearTiltState() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      active = false;
      resetTransforms();
    }

    function tick() {
      if (window.innerWidth < 768) {
        clearTiltState();
        return;
      }

      currentX = lerp(currentX, targetX, LERP);
      currentY = lerp(currentY, targetY, LERP);
      applyTransforms();

      const delta = Math.abs(currentX - targetX) + Math.abs(currentY - targetY);
      if (delta > 0.005 || active) {
        rafId = requestAnimationFrame(tick);
      } else {
        resetTransforms();
        rafId = null;
      }
    }

    const ensureLoop = () => {
      if (window.innerWidth < 768) {
        clearTiltState();
        return;
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    heroArea.addEventListener('mousemove', e => {
      if (window.innerWidth < 768) {
        clearTiltState();
        return;
      }
      const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      targetX = -ny * MAX_TILT;
      targetY = nx * MAX_TILT;
      active = true;
      ensureLoop();
    });

    heroArea.addEventListener('mouseleave', () => {
      if (window.innerWidth < 768) {
        clearTiltState();
        return;
      }
      targetX = 0;
      targetY = 0;
      active = false;
      ensureLoop();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        clearTiltState();
      }
    });

    if (window.innerWidth < 768) {
      resetTransforms();
    }
  }


  /* ——————————————————————————————————————————————
     2. SALIN EMAIL
     —————————————————————————————————————————————— */
  const copyEmailBtn = document.getElementById('copy-email-btn');

  if (copyEmailBtn) {
    let copyTimer = null;

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) { }
      document.body.removeChild(ta);
    }

    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.dataset.email;
      if (!email) return;

      const onCopied = () => {
        copyEmailBtn.textContent = 'Tersalin ✓';
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(() => { copyEmailBtn.textContent = 'Salin Email'; }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(onCopied).catch(() => { fallbackCopy(email); onCopied(); });
      } else {
        fallbackCopy(email);
        onCopied();
      }
    });
  }


  /* ——————————————————————————————————————————————
     3. PERPINDAHAN TAB KARYA
     —————————————————————————————————————————————— */
  const karyaTabs = document.querySelectorAll('.karya-tab');
  const karyaPanels = document.querySelectorAll('.karya-panel');

  if (karyaTabs.length && karyaPanels.length) {
    function switchTab(index) {
      karyaTabs.forEach(t => t.classList.remove('active'));
      karyaTabs[index].classList.add('active');

      karyaPanels.forEach(panel => {
        panel.setAttribute('hidden', '');
        panel.classList.add('panel-hidden');
      });

      const target = document.getElementById(`panel-${index}`);
      if (target) {
        target.removeAttribute('hidden');
        target.classList.remove('panel-hidden');
      }

      if (index === 2) restartAgentSim();
    }

    karyaTabs.forEach((tab, i) => tab.addEventListener('click', () => switchTab(i)));

    // Init: hide all except first
    karyaPanels.forEach((panel, i) => {
      if (i !== 0) { panel.setAttribute('hidden', ''); panel.classList.add('panel-hidden'); }
    });
  }


  /* ——————————————————————————————————————————————
     4. SIMULASI AI AGENT
     —————————————————————————————————————————————— */
  const terminalLog = document.getElementById('terminal-log');
  const wireframeStage = document.getElementById('wireframe-stage');

  const SIM_STEPS = [
    {
      cmd: '> [AGENT] Memindai kebutuhan bisnis & grid...',
      buildBlock() { return createWireBlock('[NAVBAR // JRII.DEV]'); }
    },
    {
      cmd: '> [AGENT] Menyusun tipografi & hero kontras tinggi...',
      buildBlock() { return createWireBlock('[HERO MANIFESTO // 72PX BOLD]'); }
    },
    {
      cmd: '> [AGENT] Merakit 3 modul layanan responsif...',
      buildBlock() {
        const wrapper = document.createElement('div');
        wrapper.className = 'wire-grid-3';
        ['[CARD 01]', '[CARD 02]', '[CARD 03]'].forEach(label => {
          wrapper.appendChild(createWireBlock(label));
        });
        return wrapper;
      }
    },
    {
      cmd: '> [AGENT] Optimasi 60fps & deploy selesai ✓',
      buildBlock() {
        const el = createWireBlock('[CTA & FOOTER // READY]');
        el.style.background = '#FFFFFF';
        el.style.color = '#000000';
        el.style.borderColor = '#FFFFFF';
        return el;
      }
    }
  ];

  const STEP_DELAY = 900;
  const PAUSE_DELAY = 2500;
  let simTimer = null;

  function createWireBlock(label) {
    const el = document.createElement('div');
    el.className = 'wire-block';
    el.textContent = label;
    return el;
  }

  function appendLogLine(text, isCurrent) {
    if (!terminalLog) return null;
    const line = document.createElement('div');
    line.className = 'log-line' + (isCurrent ? ' active-cmd' : '');
    line.textContent = text;
    terminalLog.appendChild(line);
    terminalLog.scrollTop = terminalLog.scrollHeight;
    return line;
  }

  function clearSim() {
    if (terminalLog) terminalLog.innerHTML = '';
    if (wireframeStage) wireframeStage.innerHTML = '';
  }

  function runStep(stepIndex, logLines) {
    if (!wireframeStage || !terminalLog) return;

    if (stepIndex >= SIM_STEPS.length) {
      simTimer = setTimeout(() => {
        wireframeStage.querySelectorAll('.wire-block').forEach(b => b.classList.remove('built'));
        simTimer = setTimeout(() => { clearSim(); runStep(0, []); }, 500);
      }, PAUSE_DELAY);
      return;
    }

    const step = SIM_STEPS[stepIndex];

    if (logLines.length > 0) {
      const prev = logLines[logLines.length - 1];
      prev.classList.remove('active-cmd');
      prev.classList.add('log-done');
    }

    const line = appendLogLine(step.cmd, true);
    logLines.push(line);

    const block = step.buildBlock();
    wireframeStage.appendChild(block);

    const targets = block.classList.contains('wire-block')
      ? [block]
      : [...block.querySelectorAll('.wire-block')];

    requestAnimationFrame(() => requestAnimationFrame(() => {
      targets.forEach(t => t.classList.add('built'));
    }));

    simTimer = setTimeout(() => runStep(stepIndex + 1, logLines), STEP_DELAY);
  }

  function restartAgentSim() {
    if (simTimer) clearTimeout(simTimer);
    clearSim();
    simTimer = setTimeout(() => runStep(0, []), 300);
  }

  const panel2 = document.getElementById('panel-2');
  if (panel2 && !panel2.hasAttribute('hidden')) restartAgentSim();


  /* ——————————————————————————————————————————————
     5. PRICING CATEGORY SWITCHER (3 KATEGORI)
        – data-index (--tab-index glider), data-target & data-label
        – Kelola #cat-website, #cat-apps, #cat-remediation
        – Reflow untuk replay cardSlideUp + strikeDraw
        – Perbarui tautan WA dinamis
     —————————————————————————————————————————————— */
  const pricingSwitcher = document.querySelector('.pricing-switcher');
  const switchBtns = document.querySelectorAll('.switch-btn');
  const pricingPanels = [
    document.getElementById('cat-website'),
    document.getElementById('cat-apps'),
    document.getElementById('cat-remediation')
  ];

  let activeCategory = 'Website Development';

  /**
   * Memastikan browser memutar ulang animasi CSS (cardSlideUp dan strikeDraw)
   * setiap kali panel kategori harga dibuka dengan melakukan reflow singkat.
   */
  function replayPanelAnimations(panel) {
    if (!panel) return;
    panel.classList.add('panel-hidden');
    panel.hidden = true;
    void panel.offsetWidth;
    panel.classList.remove('panel-hidden');
    panel.hidden = false;
    void panel.offsetWidth;
  }

  if (pricingSwitcher && switchBtns.length && pricingPanels.some(Boolean)) {

    function showCategory(btn) {
      const tabIndex = btn.dataset.index || '0';
      const targetId = btn.dataset.target;
      activeCategory = btn.dataset.label || 'Website Development';

      // 1. Pindahkan .active ke tombol yang diklik & geser glider via --tab-index
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pricingSwitcher.style.setProperty('--tab-index', tabIndex);

      // 2. Iterasi seluruh panel harga (Website, Apps, Remediation)
      pricingPanels.forEach(panel => {
        if (!panel) return;

        if (panel.id === targetId) {
          replayPanelAnimations(panel);
        } else {
          panel.classList.add('panel-hidden');
          panel.hidden = true;
        }
      });

      // 3. Perbarui pesan WA agar mencantumkan kategori aktif
      updateWhatsAppLink();
    }

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => showCategory(btn));
    });

    // Init: hanya panel pertama (#cat-website) yang tampil saat dimuat
    pricingPanels.forEach((panel, index) => {
      if (!panel) return;
      const isDefault = index === 0;
      panel.classList.toggle('panel-hidden', !isDefault);
      panel.hidden = !isDefault;
    });
    pricingSwitcher.style.setProperty('--tab-index', '0');
  }


  /* ——————————————————————————————————————————————
     6. ADD-ON CALCULATOR & DYNAMIC WHATSAPP LINK
     —————————————————————————————————————————————— */
  const addonChips = document.querySelectorAll('.addon-chip');
  const addonTotal = document.getElementById('addon-total');
  const dynamicWaBtn = document.getElementById('dynamic-wa-btn');

  function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  function calcAddonTotal() {
    let total = 0;
    addonChips.forEach(chip => {
      if (chip.classList.contains('selected')) {
        total += parseInt(chip.dataset.price, 10) || 0;
      }
    });
    return total;
  }

  function getSelectedAddonNames() {
    const names = [];
    addonChips.forEach(chip => {
      if (chip.classList.contains('selected')) {
        names.push(chip.dataset.name);
      }
    });
    return names;
  }

  function updateWhatsAppLink() {
    if (!dynamicWaBtn) return;

    const total = calcAddonTotal();
    const names = getSelectedAddonNames();

    let message;
    if (names.length > 0) {
      message =
        `Halo JRII.DEV, saya tertarik layanan ${activeCategory} dengan tambahan: ` +
        `${names.join(', ')} (Estimasi tambahan: ${formatRupiah(total)}).`;
    } else {
      message = `Halo JRII.DEV, saya ingin konsultasi pembuatan ${activeCategory}.`;
    }

    dynamicWaBtn.href =
      `https://wa.me/6285143592467?text=${encodeURIComponent(message)}`;
  }

  if (addonChips.length) {
    addonChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');

        const total = calcAddonTotal();
        if (addonTotal) {
          addonTotal.textContent = formatRupiah(total);
        }

        updateWhatsAppLink();
      });
    });

    updateWhatsAppLink();
  }


  /* ——————————————————————————————————————————————
     7. SCROLL REVEAL — IntersectionObserver
     —————————————————————————————————————————————— */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: langsung tampilkan semua
    revealElements.forEach(el => el.classList.add('is-visible'));
  }


  /* ——————————————————————————————————————————————
     8. SMOOTH ANCHOR SCROLL DENGAN OFFSET NAVBAR
     —————————————————————————————————————————————— */
  const NAVBAR_OFFSET = 96;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();

      const targetPosition =
        targetEl.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    });
  });


  /* ——————————————————————————————————————————————
     9. LIVE PROMO COUNTDOWN TIMER
        – Hitung mundur evergreen: reset ke awal saat menyentuh 0
        – Format dua digit dengan padStart(2, '0')
     —————————————————————————————————————————————— */
  const countdownEl = document.getElementById('promo-countdown');

  if (countdownEl) {
    // Durasi awal: 8 jam 42 menit 19 detik
    const INITIAL_SECONDS = 8 * 3600 + 42 * 60 + 19;
    let totalSeconds = INITIAL_SECONDS;

    function renderCountdown() {
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const ss = String(s).padStart(2, '0');

      countdownEl.textContent = `${hh} : ${mm} : ${ss}`;
    }

    // Render segera agar tidak ada flash angka lama
    renderCountdown();

    setInterval(() => {
      totalSeconds -= 1;

      // Evergreen: reset ke awal ketika menyentuh nol
      if (totalSeconds < 0) {
        totalSeconds = INITIAL_SECONDS;
      }

      renderCountdown();
    }, 1000);
  }

});
