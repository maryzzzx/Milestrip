// pages/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('[dashboard] DOM pronto');

  const $ = (id) => document.getElementById(id);
  const canvas = $('salesChart');
  if (!canvas) {
    console.error('[dashboard] #salesChart não encontrado. Verifique o HTML.');
    return;
  }

  // ===== Dados demo =====
  const labels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  });
  const values = labels.map(() => Math.floor(6 + Math.random() * 20));
  const range = `${labels[0]} — ${labels[6]}`;
  const rangeEl = $('g-range');
  if (rangeEl) rangeEl.textContent = range;

  function setupCanvas(cnv) {
    const dpr = window.devicePixelRatio || 1;
    const rect = cnv.getBoundingClientRect();

    // Fallback: se o canvas estiver sem largura/altura visíveis
    const cssW = rect.width  || cnv.clientWidth  || 600;
    const cssH = rect.height || cnv.clientHeight || 220;

    cnv.width  = Math.max(1, Math.round(cssW * dpr));
    cnv.height = Math.max(1, Math.round(cssH * dpr));

    const ctx = cnv.getContext('2d');
    // zera transform antes de escalar, para não acumular
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);

    return { ctx, w: cssW, h: cssH, dpr };
  }

  function drawChart() {
    const { ctx, w, h } = setupCanvas(canvas);

    // área interna
    const pad = 16;
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;
    const maxV = Math.max(...values) * 1.2;

    // limpar
    ctx.clearRect(0, 0, w, h);

    // eixo X
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, h - pad);
    ctx.lineTo(w - pad, h - pad);
    ctx.stroke();

    // linha
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(255,106,0,0.95)');
    grad.addColorStop(1, 'rgba(255,106,0,0.35)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;

    ctx.beginPath();
    values.forEach((v, i) => {
      const x = pad + (i / (values.length - 1)) * innerW;
      const y = pad + innerH - (v / maxV) * innerH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // pontos
    ctx.fillStyle = 'rgba(255,106,0,1)';
    values.forEach((v, i) => {
      const x = pad + (i / (values.length - 1)) * innerW;
      const y = pad + innerH - (v / maxV) * innerH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    console.log('[dashboard] gráfico redesenhado', { w, h, values });
  }

  // Desenha agora e no resize
  drawChart();
  window.addEventListener('resize', () => {
    // debounce simples
    clearTimeout(window.__chartTimer);
    window.__chartTimer = setTimeout(drawChart, 120);
  });

  // ===== KPIs demo (opcional) =====
  const money = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const salesToday   = Math.floor(Math.random() * 12) + 4;
  const revenueMonth = 25000 + Math.floor(Math.random() * 12000);
  const conversion   = (2 + Math.random() * 4).toFixed(1);
  const commissions  = Math.round(revenueMonth * 0.12);

  const fill = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  fill('kpi-sales', salesToday);
  fill('kpi-sales-sub', 'até agora');
  fill('kpi-revenue', money(revenueMonth));
  fill('kpi-revenue-sub', 'mês atual');
  fill('kpi-conversion', `${conversion}%`);
  fill('kpi-conv-sub', 'taxa média');
  fill('kpi-commission', money(commissions));
  fill('kpi-comm-sub', 'estimada');
  const year = $('year'); if (year) year.textContent = new Date().getFullYear();
});
