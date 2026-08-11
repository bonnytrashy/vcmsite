/* =====================================================================
   MÉTODO VCM — interações & micro-interações
   ===================================================================== */
(function () {
  'use strict';

  const html = document.documentElement;
  html.classList.remove('no-js');
  html.classList.add('js');

  const isTouch = window.matchMedia('(hover: none)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* CONFIG — endpoint da lista de espera (vazio = modo demonstração) */
  const FORM_ENDPOINT = 'https://n8n.protocolopentagono.com.br/webhook/2799d861-9e8f-49b1-a108-698c3b9d0038';

  /* ---------------- PRELOADER ---------------- */
  const preloader = document.getElementById('preloader');
  const revealAll = () => preloader && preloader.classList.add('done');
  window.addEventListener('load', () => setTimeout(revealAll, 1300));
  setTimeout(revealAll, 3000);

  /* ---------------- LENIS SMOOTH SCROLL (sempre ativo) ---------------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, lerp: 0.085, smoothWheel: true, wheelMultiplier: 1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    if (hasGSAP) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    window.lenis = lenis;
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.4 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------------- NAV state ---------------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------------- CUSTOM CURSOR ---------------- */
  if (!isTouch) {
    const cursor = document.querySelector('.cursor');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; cursor.style.opacity = '1'; });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,[data-cursor],.chip,.node,input,select,.orbit').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.className = 'cursor is-hover';
        const t = el.getAttribute('data-cursor');
        if (t) cursor.classList.add('type-' + t);
      });
      el.addEventListener('mouseleave', () => { cursor.className = 'cursor'; cursor.style.opacity = '1'; });
    });
  }

  /* ---------------- MAGNETIC BUTTONS ---------------- */
  if (!isTouch && window.matchMedia('(min-width: 900px)').matches) {
    document.querySelectorAll('[data-magnetic],.btn--gold,.btn--ghost').forEach((btn) => {
      const strength = 0.2;
      let cx = 0, cy = 0, active = false;
      const measure = () => { const r = btn.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; active = true; };
      btn.addEventListener('mouseenter', measure);
      btn.addEventListener('mousemove', (e) => {
        if (!active) measure();
        // centro medido SEM o transform -> não acumula (sem drift/torto)
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      btn.addEventListener('mouseleave', () => { active = false; btn.style.transform = ''; });
    });
  }

  /* ---------------- CARD 3D TILT ---------------- */
  if (!isTouch) {
    document.querySelectorAll('.pilar,.bloco,.conquistas article,.cycle__step,.prova__card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform .12s ease-out, box-shadow .5s, border-color .5s';
        card.style.transform = `perspective(900px) rotateX(${py * -5}deg) rotateY(${px * 6}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transition = 'transform .6s cubic-bezier(.19,1,.22,1), box-shadow .5s, border-color .5s';
        card.style.transform = '';
      });
    });
  }

  /* ---------------- HERO title line reveal ---------------- */
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    heroTitle.querySelectorAll('[data-line]').forEach((l, i) => l.style.setProperty('--d', (0.35 + i * 0.13) + 's'));
    requestAnimationFrame(() => setTimeout(() => heroTitle.classList.add('in'), 250));
  }

  /* ---------------- REVEAL (IntersectionObserver) ---------------- */
  // auto-broaden: micro-elements sem wrapper de reveal ganham entrada em cascata
  document.querySelectorAll(
    '.bloco li, .jornada__format .fmt, .viviane__stats div, .cycle__step, .chips .chip, .form__row, .field--group'
  ).forEach((el) => {
    if (!el.closest('[data-reveal],[data-reveal-item]') && !el.hasAttribute('data-reveal-item')) {
      el.setAttribute('data-reveal-item', '');
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-reveal],[data-reveal-item]').forEach((el) => io.observe(el));

  // stagger inside groups
  document.querySelectorAll(
    '.pilares__grid,.conquistas__grid,.jornada__track,.recon__list,.prova__cards,.ab__grid,.jornada__format,.viviane__stats,.cycle,.chips'
  ).forEach((group) => {
    group.querySelectorAll('[data-reveal-item]').forEach((el, i) => el.style.setProperty('--d', (i * 0.07) + 's'));
  });

  /* ---------------- COUNTERS ---------------- */
  const fmt = new Intl.NumberFormat('pt-BR');
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const obs = new IntersectionObserver((ents, ob) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        ob.disconnect();
        const dur = 1600, t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + fmt.format(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    obs.observe(el);
  });

  /* ---------------- MANIFESTO word-by-word ---------------- */
  const words = document.querySelectorAll('[data-reveal-word]');
  if (words.length && hasGSAP) {
    ScrollTrigger.create({
      trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 65%', scrub: 0.6,
      onUpdate: (self) => {
        const n = Math.floor(self.progress * words.length * 1.15);
        words.forEach((w, i) => w.classList.toggle('lit', i <= n));
      },
    });
  } else { words.forEach((w) => w.classList.add('lit')); }

  /* ---------------- VIRADA strike ---------------- */
  const viradaTitle = document.querySelector('.virada__title');
  if (viradaTitle) new IntersectionObserver((es, ob) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ob.disconnect(); } });
  }, { threshold: 0.55 }).observe(viradaTitle);

  /* ---------------- PARALLAX (depth) ---------------- */
  if (hasGSAP) {
    gsap.to('.hero__figure', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__ghost', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.utils.toArray('.orb').forEach((orb, i) => {
      gsap.to(orb, { yPercent: (i % 2 ? 22 : -18), ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------------- 7 TRAVAS — cinematic scroll sequence ---------------- */
  (function travasSequence() {
    const orbit = document.getElementById('orbit');
    const stage = document.getElementById('travasStage');
    const nodes = Array.from(document.querySelectorAll('.node[data-trava]'));
    const countEl = document.getElementById('travaCount');
    if (!orbit || !nodes.length) return;
    const N = nodes.length;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // build the light spokes (centre -> node)
    const spokesWrap = document.createElement('div');
    spokesWrap.className = 'orbit__spokes';
    const spokes = nodes.map((_, i) => {
      const s = document.createElement('span');
      s.className = 'spoke';
      s.style.setProperty('--i', i);
      s.style.setProperty('--appear', '0');
      spokesWrap.appendChild(s);
      return s;
    });
    orbit.insertBefore(spokesWrap, orbit.querySelector('.orbit__core'));
    orbit.classList.add('seq');

    const apply = (p) => {
      const pos = p * (N + 0.4); // small tail so #7 sits fully lit at the end
      orbit.style.setProperty('--progress', clamp(p, 0, 1).toFixed(3));
      const activeIdx = clamp(Math.floor(pos), 0, N - 1);
      nodes.forEach((node, i) => {
        // node + its spoke reveal in lockstep, snappily, then hold
        const appear = clamp((pos - i) / 0.7, 0, 1);
        node.style.setProperty('--appear', appear.toFixed(3));
        spokes[i].style.setProperty('--appear', appear.toFixed(3));
        const active = i === activeIdx;
        node.classList.toggle('lit', appear > 0.02);
        node.classList.toggle('active', active);
        spokes[i].classList.toggle('active', active);
      });
      if (countEl) countEl.textContent = String(clamp(activeIdx + 1, 1, N));
      orbit.classList.toggle('done', p >= 0.999);
    };
    apply(0);

    if (hasGSAP) {
      const dist = () => window.innerHeight * (window.innerWidth < 760 ? 2.6 : 3.4);
      ScrollTrigger.create({
        trigger: stage, start: 'top top', end: () => '+=' + dist(),
        pin: stage, pinSpacing: true, scrub: 0.5, invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onLeave: () => apply(1), onLeaveBack: () => apply(0),
      });
    } else {
      // no-gsap fallback: reveal all
      apply(1);
    }

    // tap/click a node once the sequence is done (mobile exploration)
    nodes.forEach((node) => {
      node.addEventListener('click', () => {
        if (!orbit.classList.contains('done')) return;
        const open = node.classList.contains('open');
        nodes.forEach((n) => n.classList.remove('open'));
        if (!open) node.classList.add('open');
      });
    });
  })();

  /* ---------------- RANGE ---------------- */
  const range = document.getElementById('range');
  const rangeOut = document.getElementById('rangeOut');
  if (range) {
    const paint = () => {
      const p = ((range.value - range.min) / (range.max - range.min)) * 100;
      range.style.setProperty('--p', p + '%');
      rangeOut.textContent = range.value;
    };
    paint(); range.addEventListener('input', paint);
  }

  /* ---------------- MODAL (lista de espera) ---------------- */
  const modal = document.getElementById('waitlistModal');
  let modalPanel = null;
  let resetWizard = null;
  if (modal) {
    modalPanel = modal.querySelector('.modal__panel');
    let lastFocus = null;
    const openModal = () => {
      lastFocus = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      if (lenis) lenis.stop();
      if (resetWizard) resetWizard();
      setTimeout(() => { (modal.querySelector('input[name="nome"]') || modal.querySelector('.modal__close')).focus(); }, 260);
    };
    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lenis) lenis.start();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    document.querySelectorAll('[data-modal-open]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
    modal.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  }

  /* ---------------- FORM ---------------- */
  const form = document.getElementById('waitlist');
  const success = document.getElementById('success');
  const markInvalid = (el, bad) => {
    if (el.tagName === 'SELECT') { (el.closest('.select') || el).classList.toggle('invalid', bad); }
    else el.classList.toggle('invalid', bad);
  };

  if (form) {
    /* ---- wizard: 3 passos ---- */
    const steps = Array.from(form.querySelectorAll('.wz__step'));
    if (steps.length) {
      const bar = form.querySelector('#wzBar');
      const stepNum = form.querySelector('#wzStep');
      const backBtn = form.querySelector('#wzBack');
      const nextBtn = form.querySelector('#wzNext');
      const submitBtn = form.querySelector('#wzSubmit');
      let cur = 0;
      const validateStep = (i) => {
        let ok = true, firstBad = null;
        const step = steps[i];
        step.querySelectorAll('input[required],select[required]').forEach((el) => {
          const empty = !el.value || (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
          markInvalid(el, empty);
          if (empty) { ok = false; firstBad = firstBad || el; }
        });
        step.querySelectorAll('.field--group').forEach((g) => {
          const r = g.querySelector('input[type="radio"]');
          if (r && !form.querySelector(`input[name="${r.name}"]:checked`)) { ok = false; firstBad = firstBad || g; }
        });
        if (!ok) { form.classList.add('shake'); setTimeout(() => form.classList.remove('shake'), 450); if (firstBad && firstBad.scrollIntoView) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return ok;
      };
      const render = (scroll) => {
        steps.forEach((s, i) => s.classList.toggle('is-active', i === cur));
        if (bar) bar.style.width = ((cur + 1) / steps.length * 100) + '%';
        if (stepNum) stepNum.textContent = cur + 1;
        const last = cur === steps.length - 1;
        backBtn.hidden = cur === 0;
        nextBtn.hidden = last;
        submitBtn.hidden = !last;
        if (scroll && modalPanel) modalPanel.scrollTo({ top: 0, behavior: 'smooth' });
      };
      nextBtn.addEventListener('click', () => { if (validateStep(cur)) { cur = Math.min(cur + 1, steps.length - 1); render(true); } });
      backBtn.addEventListener('click', () => { cur = Math.max(cur - 1, 0); render(true); });
      resetWizard = () => {
        cur = 0;
        form.hidden = false;
        if (success) success.hidden = true;
        const head = modal && modal.querySelector('.modal__head');
        if (head) head.hidden = false;
        if (submitBtn) { const lbl = submitBtn.querySelector('.btn__label'); if (lbl) lbl.textContent = 'Entrar na lista de espera'; }
        render(false);
      };
      render(false);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true, firstBad = null;
      form.querySelectorAll('input[required],select[required]').forEach((el) => {
        const empty = !el.value || (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
        markInvalid(el, empty);
        if (empty) { valid = false; firstBad = firstBad || el; }
      });
      ['trava', 'desejo'].forEach((name) => {
        if (!form.querySelector(`input[name="${name}"]:checked`)) {
          valid = false; firstBad = firstBad || form.querySelector(`input[name="${name}"]`).closest('.field--group');
        }
      });
      if (!valid) {
        if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.classList.add('shake'); setTimeout(() => form.classList.remove('shake'), 500);
        return;
      }
      const fd = new FormData(form);
      const data = {
        nome: (fd.get('nome') || '').toString().trim(),
        whatsapp: (fd.get('whatsapp') || '').toString().trim(),
        email: (fd.get('email') || '').toString().trim(),
        instagram: (fd.get('instagram') || '').toString().trim(),
        momento_carreira: fd.get('carreira') || '',
        principal_trava: fd.get('trava') || '',
        objetivo_12_meses: fd.get('desejo') || '',
        faixa_investimento: fd.get('investimento') || '',
        intencao_turma: fd.get('intencao') || '',
        comprometimento: fd.get('comprometimento') || '',
        origem: 'landing-vcm',
        pagina: location.href,
        enviado_em: new Date().toISOString(),
      };
      const btn = form.querySelector('.btn--submit .btn__label');
      const original = btn.textContent; btn.textContent = 'Enviando…';
      try {
        if (FORM_ENDPOINT) {
          // urlencoded + no-cors: requisição "simples" (sem preflight) -> chega no n8n estruturado
          await fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data), keepalive: true });
        } else {
          const list = JSON.parse(localStorage.getItem('vcm_leads') || '[]');
          list.push(data); localStorage.setItem('vcm_leads', JSON.stringify(list));
          await new Promise((r) => setTimeout(r, 500));
        }
        const head = modal && modal.querySelector('.modal__head');
        if (head) head.hidden = true;
        form.hidden = true; success.hidden = false;
        if (modalPanel) modalPanel.scrollTop = 0;
        else if (success.scrollIntoView) { if (lenis) lenis.scrollTo(success, { offset: -120 }); else success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      } catch (err) { btn.textContent = original; alert('Não foi possível enviar agora. Tente novamente em instantes.'); }
    });
    form.querySelectorAll('input,select').forEach((el) => {
      el.addEventListener('input', () => markInvalid(el, false));
      el.addEventListener('change', () => markInvalid(el, false));
    });
  }

  /* ---------------- JORNADA — preenchimento da linha do tempo ---------------- */
  (function timelineSpine() {
    const fill = document.getElementById('tlFill');
    const tl = document.querySelector('.timeline');
    if (!fill || !tl) return;
    if (hasGSAP) {
      fill.style.setProperty('--fill', '0');
      ScrollTrigger.create({
        trigger: tl, start: 'top 72%', end: 'bottom 80%', scrub: 0.5,
        onUpdate: (self) => fill.style.setProperty('--fill', self.progress.toFixed(3)),
      });
    } else {
      fill.style.setProperty('--fill', '1');
    }
  })();

  if (hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 1600);
})();
