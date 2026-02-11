
// Financeiro (demo) — KPIs, gráfico, repasses e comissões com dados mock
(function(){
  const $ = (id) => document.getElementById(id);
  const money = (v) => Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

  // ===== KPIs =====
  const balance = 3420.55;
  const monthGross = 12890.35;
  const nextPayout = 950.00;
  const nextDate = new Date(); nextDate.setDate(nextDate.getDate()+5);
  const late = 2;

  $('kpi-balance').textContent = money(balance);
  $('kpi-month').textContent = money(monthGross);
  $('kpi-next').textContent = money(nextPayout);
  $('kpi-next-date').textContent = nextDate.toLocaleDateString('pt-BR');
  $('kpi-late').textContent = late;

  // ===== Gráfico 6 meses =====
  const labels = Array.from({length:6}, (_,i)=>{
    const d = new Date(); d.setMonth(d.getMonth()-(5-i));
    return d.toLocaleDateString('pt-BR',{month:'2-digit', year:'2-digit'});
  });
  const values = labels.map(()=> 6000 + Math.floor(Math.random()*8000));
  const rangeEl = $('g-range'); if (rangeEl) rangeEl.textContent = `${labels[0]} — ${labels[5]}`;

  const canvas = $('finChart');
  if(canvas){
    const ctx = canvas.getContext('2d');
    function fit(){
      const dpr = window.devicePixelRatio||1;
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width||canvas.clientWidth||600;
      const cssH = rect.height||canvas.clientHeight||220;
      canvas.width = Math.round(cssW*dpr); canvas.height = Math.round(cssH*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return {w:cssW,h:cssH};
    }
    function draw(){
      const {w,h} = fit();
      const pad=16, innerW=w-pad*2, innerH=h-pad*2;
      const maxV=Math.max(...values)*1.2;
      ctx.clearRect(0,0,w,h);
      ctx.strokeStyle='rgba(255,255,255,.18)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(pad,h-pad); ctx.lineTo(w-pad,h-pad); ctx.stroke();
      const grad=ctx.createLinearGradient(0,0,0,h); grad.addColorStop(0,'rgba(255,106,0,.95)'); grad.addColorStop(1,'rgba(255,106,0,.35)');
      ctx.strokeStyle=grad; ctx.lineWidth=2; ctx.beginPath();
      values.forEach((v,i)=>{ const x=pad+(i/(values.length-1))*innerW; const y=pad+innerH-(v/maxV)*innerH; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
      ctx.stroke();
      ctx.fillStyle='rgba(255,106,0,1)';
      values.forEach((v,i)=>{ const x=pad+(i/(values.length-1))*innerW; const y=pad+innerH-(v/maxV)*innerH; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); });
    }
    draw();
    window.addEventListener('resize', ()=>{ clearTimeout(window.__finTimer); window.__finTimer=setTimeout(draw,120); });
  }

  // ===== Tabela de repasses (mock) =====
  const payouts = [
    { id:'#RP-1032', data: new Date(), valor:1200, metodo:'PIX', status:'pendente' },
    { id:'#RP-1031', data: new Date(Date.now()-86400000*4), valor:950, metodo:'Transferência', status:'pago' },
    { id:'#RP-1029', data: new Date(Date.now()-86400000*12), valor:720, metodo:'PIX', status:'pago' },
  ];
  const pBody = $('payoutsBody');
  if(pBody){
    pBody.innerHTML = payouts.map(p=>`
      <tr>
        <td>${p.id}</td>
        <td>${p.data.toLocaleDateString('pt-BR')}</td>
        <td>${money(p.valor)}</td>
        <td>${p.metodo}</td>
        <td><span class="badge-status ${p.status}">${p.status}</span></td>
        <td>
          ${p.status==='pendente' ? '<button class="btn small" data-acao="marcarPago" data-id="'+p.id+'">Marcar pago</button>' : ''}
          <button class="btn small ghost" data-acao="detalhar" data-id="${p.id}">Detalhes</button>
        </td>
      </tr>
    `).join('');

    pBody.addEventListener('click', (e)=>{
      const el = e.target;
      const ac = el.getAttribute('data-acao');
      const id = el.getAttribute('data-id');
      if(!ac) return;
      if(ac==='marcarPago'){
        const i = payouts.findIndex(x=>x.id===id);
        if(i>-1){ payouts[i].status='pago'; pBody.querySelectorAll('tr')[i].querySelector('.badge-status').className='badge-status pago'; pBody.querySelectorAll('tr')[i].querySelector('.badge-status').textContent='pago'; }
      }else if(ac==='detalhar'){
        alert('Repasse '+id+' — '+money((payouts.find(x=>x.id===id)||{}).valor||0));
      }
    });
  }

  // ===== Tabela de comissões por pedido (mock) =====
  const orders = Array.from({length:8}, (_,i)=>({
    id:'#PD-'+(2180+i), cliente:['Ana','Bruno','Carla','Diego','Eva','Fábio','Gabi','Heitor'][i],
    produto:['Pacote RJ','Seguro Viagem','Passagem GIG-SSA','Hotel SP','Consultoria','Pacote BUE','Pacote POA','Pacote JPA'][i],
    total: 600 + Math.floor(Math.random()*5200),
    comissaoPerc: 12,
    status: ['pago','pendente','pago','pago','atrasado','pago','pago','pendente'][i],
    data: new Date(Date.now() - i*86400000)
  }));
  const oBody = $('ordersBody');
  if(oBody){
    oBody.innerHTML = orders.map(o=>`
      <tr>
        <td>${o.id}</td>
        <td>${o.cliente}</td>
        <td>${o.produto}</td>
        <td>${money(o.total)}</td>
        <td>${money(o.total * (o.comissaoPerc/100))}</td>
        <td><span class="badge-status ${o.status}">${o.status}</span></td>
        <td>${o.data.toLocaleDateString('pt-BR')}</td>
      </tr>
    `).join('');
  }

  // ===== Filtros topo =====
  const refMonth = $('refMonth');
  const statusFilter = $('statusFilter');
  $('exportCsv')?.addEventListener('click', ()=>{
    const header = ['Pedido','Cliente','Produto','Total','Comissão','Status','Data'];
    const rows = orders.map(o=>[o.id,o.cliente,o.produto,money(o.total), money(o.total*(o.comissaoPerc/100)), o.status, o.data.toLocaleDateString('pt-BR')]);
    const csv = [header, ...rows].map(r=>r.join(';')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'comissoes.csv'; a.click(); URL.revokeObjectURL(a.href);
  });
  refMonth?.addEventListener('change', ()=>{/* aqui você pode filtrar por mês futuramente */});
  statusFilter?.addEventListener('change', ()=>{/* aqui você pode filtrar por status futuramente */});

  // Solicitar saque (demo)
  $('requestPayout')?.addEventListener('click', ()=>{
    alert('Solicitação de saque recebida! (demo)');
  });

  // Logout demo
  document.getElementById('logoutBtn')?.addEventListener('click', ()=>{
    localStorage.removeItem('auth_token');
    location.href = '../loginvendedor.html';
  });
})();

