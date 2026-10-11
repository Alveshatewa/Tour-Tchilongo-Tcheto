(() => {
  'use strict';

  const WHATSAPP_NUMBER = '244946565880'; 

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  function showToast(msg, ms = 3200) {
    let t = $('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add('is-visible'));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('is-visible'), ms);
  }

  (function themeInit() {
    const root = document.documentElement;
    const saved = localStorage.getItem('ttt-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

    $$('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('ttt-theme', next);
      });
    });
  })();

  (function navInit() {
    const nav = $('.nav');
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const burger = $('.burger');
    const panel = $('.mobile-panel');
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-open');
      panel.classList.toggle('is-open');
      document.body.style.overflow = panel.classList.contains('is-open') ? 'hidden' : '';
    });
    $$('.mobile-panel a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('is-open');
      panel.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  })();

  (function revealInit() {
    const items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(i => io.observe(i));
  })();

  (function carouselInit() {
    const root = $('.carousel');
    if (!root) return;
    const slides = $$('.slide', root);
    const dotsWrap = $('.carousel-dots');
    let idx = 0, timer = null;
    const INTERVAL = 4500;

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Ir para imagem ${i + 1}`);
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });
    const dots = $$('button', dotsWrap);

    function render() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }
    function goTo(i) { idx = (i + slides.length) % slides.length; render(); restart(); }
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, INTERVAL); }

    $('.carousel-controls .next').addEventListener('click', next);
    $('.carousel-controls .prev').addEventListener('click', prev);
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', restart);

    render();
    restart();
  })();

  (function mapInit() {
    const shapes = $$('.province-shape');
    const panel = $('#provincePanel');
    if (!shapes.length || !panel) return;

    const DATA = {
      huila: {
        name: 'Huíla', tag: 'Planalto & Cânions', color: 'var(--green)', soft: 'var(--green-soft)',
        desc: 'Terra da Serra da Leba e dos cânions esculpidos em rocha vermelha — o coração do turismo de aventura em Angola.',
        photos: ['assets/img/serra-leba.jpg', 'assets/img/canyon-huila.jpg'],
        spots: [
          { name: 'Serra da Leba', dist: '38 km do Lubango' },
          { name: 'Cânion do Tundavala', dist: '18 km do Lubango' },
          { name: 'Cristo Rei do Lubango', dist: '5 km do Lubango' },
        ]
      },
      namibe: {
        name: 'Namibe', tag: 'Deserto & Costa', color: 'var(--orange)', soft: 'var(--orange-soft)',
        desc: 'Onde o deserto encontra o Atlântico — dunas, a icónica Árvore de Um Só Tronco e baías intocadas.',
        photos: ['assets/img/por-do-sol.jpg', 'assets/img/vale-canyon.jpg'],
        spots: [
          { name: 'Deserto do Namibe', dist: '15 km da cidade' },
          { name: 'Baía Azul', dist: '22 km da cidade' },
          { name: 'Árvore de Um Só Tronco', dist: '40 km da cidade' },
        ]
      },
      benguela: {
        name: 'Benguela', tag: 'Praias & Cultura', color: 'var(--blue)', soft: 'var(--blue-soft)',
        desc: 'Praias históricas, o comboio de Caminho de Ferro de Benguela e o pôr-do-sol mais fotografado da costa.',
        photos: ['assets/img/ponte-noite.jpg', 'assets/img/letreiro-noite.jpg'],
        spots: [
          { name: 'Praia Morena', dist: '4 km de Benguela' },
          { name: 'Baía Farta', dist: '12 km de Benguela' },
          { name: 'Restinga do Lobito', dist: '28 km de Benguela' },
        ]
      }
    };

    function renderPanel(key) {
      const d = DATA[key];
      panel.innerHTML = `
        <span class="panel-tag" style="background:${d.soft};color:${d.color}">${d.tag}</span>
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <div class="panel-photos">
          ${d.photos.map(p => `<img src="${p}" alt="${d.name}" loading="lazy">`).join('')}
        </div>
        <div class="panel-spots">
          ${d.spots.map(s => `<div class="panel-spot"><span>${s.name}</span><span class="dist">${s.dist}</span></div>`).join('')}
        </div>
        <a class="btn btn-primary btn-block" style="margin-top:22px" target="_blank" rel="noopener"
           href="${waLink(`Olá! Quero saber mais sobre tours em ${d.name}.`)}">Falar sobre ${d.name}</a>
      `;
    }

    function select(key) {
      shapes.forEach(s => s.classList.toggle('is-active', s.dataset.province === key));
      renderPanel(key);
    }

    shapes.forEach(s => s.addEventListener('click', () => select(s.dataset.province)));
    $$('.map-pin').forEach(p => p.addEventListener('click', () => select(p.dataset.province)));

    select('huila');

    const expandBtn = $('#mapExpand');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        $('#mapAngola').classList.toggle('is-expanded');
        const expanded = $('#mapAngola').classList.contains('is-expanded');
        $$('.province-shape.is-inactive').forEach(s => s.style.opacity = expanded ? '.35' : '0');
        expandBtn.textContent = expanded ? 'Ver apenas 3 províncias' : 'Ver Angola completa';
      });
    }
  })();

  (function wizardInit() {
    const wizard = $('#wizard');
    if (!wizard) return;
    const tabs = $$('.wizard-step-tab', wizard);
    const panels = $$('.wizard-panel', wizard);
    const btnBack = $('#wizBack');
    const btnNext = $('#wizNext');
    let step = 1;
    const total = panels.length;

    const state = {
      destino: null,
      dataInicio: '', dataFim: '', pessoas: 2,
      guia: null, orcamento: 400,
    };

    function renderStep() {
      tabs.forEach((t, i) => {
        const n = i + 1;
        t.classList.toggle('is-active', n === step);
        t.classList.toggle('is-done', n < step);
      });
      panels.forEach((p, i) => p.classList.toggle('is-active', i + 1 === step));
      btnBack.disabled = step === 1;
      btnNext.textContent = step === total ? 'Enviar' : 'Continuar';
      if (step === total) buildSummary();
    }

    function goStep(n) {
      if (n > step && !validateStep(step)) return;
      step = Math.min(Math.max(n, 1), total);
      renderStep();
    }

    function validateStep(s) {
      if (s === 1 && !state.destino) { showToast('Escolha um destino para continuar.'); return false; }
      if (s === 2 && (!state.dataInicio || !state.dataFim)) { showToast('Indique as datas da viagem.'); return false; }
      if (s === 3 && !state.guia) { showToast('Escolha uma modalidade de guia.'); return false; }
      return true;
    }

    $$('.option-card[data-destino]', wizard).forEach(card => {
      card.addEventListener('click', () => {
        $$('.option-card[data-destino]', wizard).forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        state.destino = card.dataset.destino;
      });
    });

    const inicioInput = $('#dataInicio'), fimInput = $('#dataFim');
    inicioInput.addEventListener('change', () => state.dataInicio = inicioInput.value);
    fimInput.addEventListener('change', () => state.dataFim = fimInput.value);

    const counterVal = $('#pessoasCount');
    $('#pessoasMinus').addEventListener('click', () => { state.pessoas = Math.max(1, state.pessoas - 1); counterVal.textContent = state.pessoas; });
    $('#pessoasPlus').addEventListener('click', () => { state.pessoas = Math.min(20, state.pessoas + 1); counterVal.textContent = state.pessoas; });

    $$('.option-card[data-guia]', wizard).forEach(card => {
      card.addEventListener('click', () => {
        $$('.option-card[data-guia]', wizard).forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        state.guia = card.dataset.guia;
      });
    });
    const orcamentoRange = $('#orcamentoRange'), orcamentoOut = $('#orcamentoValue');
    orcamentoRange.addEventListener('input', () => {
      state.orcamento = Number(orcamentoRange.value);
      orcamentoOut.textContent = `$${state.orcamento}`;
    });

    function buildSummary() {
      const destinoLabels = { huila: 'Huíla - Serra da Leba & Cânions', namibe: 'Namibe - Deserto & Costa', benguela: 'Benguela - Praias & Cultura' };
      const guiaLabels = { essencial: 'Guia essencial (grupo)', privado: 'Guia privado', premium: 'Guia premium + transporte' };
      $('#sumDestino').textContent = destinoLabels[state.destino] || '—';
      $('#sumDatas').textContent = state.dataInicio && state.dataFim ? `${state.dataInicio} → ${state.dataFim}` : '—';
      $('#sumPessoas').textContent = `${state.pessoas} pessoa(s)`;
      $('#sumGuia').textContent = guiaLabels[state.guia] || '—';
      $('#sumOrcamento').textContent = `$${state.orcamento} / pessoa`;
      $('#sumTotal').textContent = `$${state.orcamento * state.pessoas}`;
    }

    btnNext.addEventListener('click', () => {
      if (step < total) { goStep(step + 1); return; }
      if (!validateStep(3)) return;
      const destinoLabels = { huila: 'Huíla', namibe: 'Namibe', benguela: 'Benguela' };
      const guiaLabels = { essencial: 'Guia essencial (grupo)', privado: 'Guia privado', premium: 'Guia premium + transporte' };
      const msg = [
        '*Novo pedido de planeamento de tour*',
        `Destino: ${destinoLabels[state.destino]}`,
        `Datas: ${state.dataInicio} até ${state.dataFim}`,
        `Grupo: ${state.pessoas} pessoa(s)`,
        `Guia: ${guiaLabels[state.guia]}`,
        `Orçamento: $${state.orcamento} por pessoa (total estimado $${state.orcamento * state.pessoas})`,
      ].join('\n');
      window.open(waLink(msg), '_blank', 'noopener');
    });
    btnBack.addEventListener('click', () => goStep(step - 1));
    tabs.forEach((t, i) => t.addEventListener('click', () => goStep(i + 1)));

    renderStep();
  })();

  (function signupInit() {
    const form = $('#signupForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const nome = fd.get('nome'), email = fd.get('email'), telefone = fd.get('telefone');
      const destino = fd.get('destino'), pessoas = fd.get('pessoas'), mensagem = fd.get('mensagem');

      if (!nome || !telefone || !destino) { showToast('Preencha o nome, telefone e destino.'); return; }

      const msg = [
        '*Nova inscrição - Tour Tchilongo Tcheto*',
        `Nome: ${nome}`,
        email ? `E-mail: ${email}` : null,
        `Telefone: ${telefone}`,
        `Destino de interesse: ${destino}`,
        pessoas ? `Nº de pessoas: ${pessoas}` : null,
        mensagem ? `Mensagem: ${mensagem}` : null,
      ].filter(Boolean).join('\n');

      window.open(waLink(msg), '_blank', 'noopener');
      showToast('A abrir o WhatsApp com os seus dados…');
      form.reset();
    });
  })();

  (function restaurantsInit() {
    const grid = $('#restGrid');
    if (!grid) return;
    const chips = $$('.filter-chip');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        const city = chip.dataset.city;
        $$('.rest-card', grid).forEach(card => {
          card.style.display = (city === 'todos' || card.dataset.city === city) ? '' : 'none';
        });
      });
    });

    $$('.rest-call', grid).forEach(btn => {
      btn.addEventListener('click', () => window.open(`tel:${btn.dataset.tel}`, '_self'));
    });
  })();

  (function faqInit() {
    $$('.faq-item').forEach(item => {
      const q = $('.faq-q', item);
      const a = $('.faq-a', item);
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        $$('.faq-item').forEach(i => { i.classList.remove('is-open'); $('.faq-a', i).style.maxHeight = null; });
        if (!isOpen) { item.classList.add('is-open'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });
    $$('.faq-shortcuts a').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  })();

  (function waLinksInit() {
    const defaultMsg = 'Olá! Gostaria de mais informações sobre os tours da Tour Tchilongo Tcheto.';
    const el = $('#waFloat');
    if (el) el.href = waLink(defaultMsg);
    const faqLink = $('#faqWaLink');
    if (faqLink) faqLink.href = waLink('Olá! Tenho uma dúvida que não encontrei nas perguntas frequentes.');
  })();


  (function eventModalInit() {
    const modal = $('#eventModal');
    if (!modal) return;
    const SEEN_KEY = 'ttt-excursao-popup-seen';

    function open() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      sessionStorage.setItem(SEEN_KEY, '1');
    }

    $$('[data-modal-close]', modal).forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    if (!sessionStorage.getItem(SEEN_KEY)) {
      setTimeout(open, 500);
    }
  })();

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();

