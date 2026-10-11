
(() => {
  'use strict';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const waLink = (text) => window.TTT_CONFIG.waLink(text);

  const EVENT_DATE = new Date('2026-10-31T00:00:00+01:00'); 


  (function countdownInit() {
    const box = $('#countdown');
    if (!box) return;
    const elDays = $('#cdDays'), elHours = $('#cdHours'), elMin = $('#cdMin'), elSec = $('#cdSec');

    function tick() {
      const now = new Date();
      const diff = EVENT_DATE - now;
      if (diff <= 0) {
        box.innerHTML = '<div class="countdown-box" style="min-width:auto"><b style="font-size:18px"> A excursão já vai a caminho!</b></div>';
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      elDays.textContent = String(days).padStart(2, '0');
      elHours.textContent = String(hours).padStart(2, '0');
      elMin.textContent = String(mins).padStart(2, '0');
      elSec.textContent = String(secs).padStart(2, '0');
    }
    tick();
    const timer = setInterval(tick, 1000);
  })();

  
  // (function pricingInit() {
  //   const select = $('#modalidadeSelect');
  //   $$('.price-select').forEach(btn => {
  //     btn.addEventListener('click', () => {
  //       if (select) select.value = btn.dataset.modalidade;
  //       const form = $('#excursaoForm');
  //       if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //     });
  //   });
  // })();


  (function excursaoFormInit() {
    const form = $('#excursaoForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const nome = fd.get('nome'), telefone = fd.get('telefone'), email = fd.get('email');
      const origem = fd.get('origem'), mensagem = fd.get('mensagem');
      const pessoas = fd.get('pessoas')

      if (!nome || !telefone) {
        const toast = document.createElement('div');
        toast.className = 'toast is-visible';
        toast.textContent = 'Preencha os campos: NOME e  TELEFONE';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
        return;
      }

      const msg = [
        ' *Inscrição - Especial Pôr-do-Sol (Fenda da Tundavala)*',
        `Nome: ${nome}`,
        email ? `E-mail: ${email}` : null,
        `Telefone: ${telefone}`,
        // `Modalidade: ${modalidadeLabels[modalidade] || modalidade}`,
        `Nº de pessoas: ${pessoas}`,
        origem ? `Como soube: ${origem}` : null,
        mensagem ? `Mensagem: ${mensagem}` : null,
      ].filter(Boolean).join('\n');

      window.open(waLink(msg), '_blank', 'noopener');
      form.reset();
    });
  })();


  (function waFloatOverride() {
    const el = $('#waFloat');
    if (!el) return;
    el.href = waLink('Olá! Tenho uma dúvida sobre a excursão a ser realizada no dia 31 de Outubro.');
  })();

})();
