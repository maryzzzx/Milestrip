
// Pacotes CRUD + LocalStorage
(function(){
  var $ = function(sel){ return document.querySelector(sel); };
  var tbody = $('#pkgsBody');
  var search = $('#searchPkg');
  var statusFilter = $('#statusFilter');
  var sortBy = $('#sortBy');
  var exportBtn = $('#exportPkgs');
  var addBtn = $('#addPkg');
  var clearAllBtn = $('#clearAll');

  // Modal
  var backdrop = $('#modalBackdrop');
  var titleEl = $('#modalTitle');
  var mNome = $('#mNome');
  var mDestino = $('#mDestino');
  var mValidade = $('#mValidade');
  var mPreco = $('#mPreco');
  var mMilhas = $('#mMilhas');
  var mVagas = $('#mVagas');
  var mStatus = $('#mStatus');
  var closeModalBtn = $('#closeModal');
  var cancelModalBtn = $('#cancelModal');
  var savePkgBtn = $('#savePkg');
  var deletePkgBtn = $('#deletePkg');

  if (!tbody) { console.error('[pacotes] tbody #pkgsBody não encontrado'); return; }

  var LS_KEY = 'mt_packages_v1';
  var SEED = [
    { id:1, nome:'Lisboa FDS', destino:'Lisboa', preco:2899.90, milhas:9600, vagas:6, validade:'2025-12-15', status:'ativo' },
    { id:2, nome:'Rio ➜ Salvador', destino:'Salvador', preco:1299.00, milhas:7500, vagas:12, validade:'2025-11-30', status:'ativo' },
    { id:3, nome:'Buenos Aires Romântico', destino:'Buenos Aires', preco:1999.00, milhas:12000, vagas:4, validade:'2025-12-05', status:'inativo' }
  ];

  function load(){
    try{
      var raw = localStorage.getItem(LS_KEY);
      if(!raw){ localStorage.setItem(LS_KEY, JSON.stringify(SEED)); return SEED.slice(); }
      var data = JSON.parse(raw);
      if(!Array.isArray(data) || data.length===0){ localStorage.setItem(LS_KEY, JSON.stringify(SEED)); return SEED.slice(); }
      return data;
    }catch(e){ console.error('[pacotes] erro load', e); localStorage.setItem(LS_KEY, JSON.stringify(SEED)); return SEED.slice(); }
  }
  function save(){ localStorage.setItem(LS_KEY, JSON.stringify(pkgs)); }

  var pkgs = load();
  var editingId = null;

  function money(v){ return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
  function toBR(iso){ if(!iso) return ''; var d = new Date(iso+'T00:00:00'); if(isNaN(d)) return iso; return d.toLocaleDateString('pt-BR'); }

  function render(data){
    tbody.innerHTML = data.map(function(p){
      return '\n      <tr>\n        <td>'+p.id+'</td>\n        <td>'+p.nome+'</td>\n        <td>'+p.destino+'</td>\n        <td>'+money(p.preco)+'</td>\n        <td>'+Number(p.milhas||0).toLocaleString('pt-BR')+'</td>\n        <td>'+Number(p.vagas||0)+'</td>\n        <td>'+toBR(p.validade)+'</td>\n        <td><span class="badge-status '+p.status+'">'+p.status+'</span></td>\n        <td>\n          <button class="btn small" data-edit="'+p.id+'">Editar</button>\n          <button class="btn small" data-dup="'+p.id+'">Duplicar</button>\n          <button class="btn small danger" data-del="'+p.id+'">Excluir</button>\n          <button class="btn small ghost" data-toggle="'+p.id+'">'+(p.status==='ativo'?'Desativar':'Ativar')+'</button>\n        </td>\n      </tr>\n      ';
    }).join('');
  }

  function refilter(){
    var term = (search && search.value || '').toLowerCase();
    var status = (statusFilter && statusFilter.value) || 'todos';

    var data = pkgs.filter(function(p){
      var okTerm = p.nome.toLowerCase().includes(term) || p.destino.toLowerCase().includes(term);
      var okStatus = (status==='todos') || (p.status===status);
      return okTerm && okStatus;
    });

    if (sortBy){
      var sv = sortBy.value || 'nome-asc';
      var parts = sv.split('-');
      var field = parts[0];
      var dir = parts[1];
      var mul = dir==='asc'?1:-1;
      data.sort(function(a,b){
        if(field==='nome') return a.nome.localeCompare(b.nome)*mul;
        if(field==='preco') return (Number(a.preco)-Number(b.preco))*mul;
        if(field==='vagas') return (Number(a.vagas)-Number(b.vagas))*mul;
        if(field==='validade') return (new Date(a.validade)-new Date(b.validade))*mul;
        return 0;
      });
    }

    render(data);
  }

  function openModal(id){
    editingId = (typeof id==='number') ? id : null;
    if(editingId){
      titleEl.textContent = 'Editar pacote';
      var p = pkgs.find(function(x){return x.id===editingId});
      mNome.value = p && p.nome || '';
      mDestino.value = p && p.destino || '';
      mValidade.value = p && p.validade || '';
      mPreco.value = p && p.preco || 0;
      mMilhas.value = p && p.milhas || 0;
      mVagas.value = p && p.vagas || 0;
      mStatus.value = p && p.status || 'ativo';
      if(deletePkgBtn) deletePkgBtn.style.display = 'inline-flex';
    } else {
      titleEl.textContent = 'Novo pacote';
      mNome.value = '';
      mDestino.value = '';
      mValidade.value = new Date().toISOString().slice(0,10);
      mPreco.value = 0; mMilhas.value = 0; mVagas.value = 0;
      mStatus.value = 'ativo';
      if(deletePkgBtn) deletePkgBtn.style.display = 'none';
    }
    if(backdrop) backdrop.style.display = 'flex';
  }
  function closeModal(){ if(backdrop) backdrop.style.display = 'none'; }

  // Eventos gerais
  addBtn && addBtn.addEventListener('click', function(){ openModal(null); });
  closeModalBtn && closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn && cancelModalBtn.addEventListener('click', closeModal);
  backdrop && backdrop.addEventListener('click', function(e){ if(e.target===backdrop) closeModal(); });

  tbody.addEventListener('click', function(e){
    var t = e.target;
    var editId = t.getAttribute('data-edit');
    var delId = t.getAttribute('data-del');
    var dupId = t.getAttribute('data-dup');
    var togId = t.getAttribute('data-toggle');

    if(editId){ openModal(Number(editId)); }
    if(delId){
      var id = Number(delId);
      if(confirm('Excluir este pacote?')){
        pkgs = pkgs.filter(function(p){ return p.id!==id });
        save(); refilter();
      }
    }
    if(dupId){
      var idd = Number(dupId);
      var base = pkgs.find(function(p){ return p.id===idd });
      if(base){
        var nextId = pkgs.length ? Math.max.apply(null, pkgs.map(function(p){return p.id})) + 1 : 1;
        var copy = Object.assign({}, base, { id: nextId, nome: base.nome+' (cópia)' });
        pkgs.push(copy); save(); refilter();
      }
    }
    if(togId){
      var idt = Number(togId);
      pkgs = pkgs.map(function(p){
        if(p.id===idt){ p.status = (p.status==='ativo'?'inativo':'ativo'); }
        return p;
      });
      save(); refilter();
    }
  });

  savePkgBtn && savePkgBtn.addEventListener('click', function(){
    var nome = mNome.value.trim(); if(!nome){ alert('Informe o nome.'); mNome.focus(); return; }
    var destino = mDestino.value.trim();
    var validade = mValidade.value;
    var preco = Number(mPreco.value||0);
    var milhas = Number(mMilhas.value||0);
    var vagas = Number(mVagas.value||0);
    var status = mStatus.value || 'ativo';

    if(editingId){
      pkgs = pkgs.map(function(p){
        if(p.id===editingId){
          p.nome = nome; p.destino = destino; p.validade = validade; p.preco = preco; p.milhas = milhas; p.vagas = vagas; p.status = status;
        }
        return p;
      });
    } else {
      var nextId = pkgs.length ? Math.max.apply(null, pkgs.map(function(p){return p.id})) + 1 : 1;
      pkgs.push({ id: nextId, nome: nome, destino: destino, validade: validade, preco: preco, milhas: milhas, vagas: vagas, status: status });
    }
    save(); closeModal(); refilter();
  });

  deletePkgBtn && deletePkgBtn.addEventListener('click', function(){
    if(editingId && confirm('Excluir este pacote?')){
      pkgs = pkgs.filter(function(p){ return p.id!==editingId });
      save(); closeModal(); refilter();
    }
  });

  search && search.addEventListener('input', refilter);
  statusFilter && statusFilter.addEventListener('change', refilter);
  sortBy && sortBy.addEventListener('change', refilter);

  clearAllBtn && clearAllBtn.addEventListener('click', function(){
    if(confirm('Isto apagará todos os pacotes salvos localmente. Continuar?')){
      pkgs = []; save(); refilter();
    }
  });

  exportBtn && exportBtn.addEventListener('click', function(){
    var header = ['ID','Nome','Destino','Preço','Milhas','Vagas','Validade','Status'];
    var rows = pkgs.map(function(p){ return [p.id, p.nome, p.destino, p.preco, p.milhas, p.vagas, toBR(p.validade), p.status]; });
    var csv = [header].concat(rows).map(function(r){ return r.join(';'); }).join('\n');
    var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pacotes.csv'; a.click(); URL.revokeObjectURL(a.href);
  });

  // Logout demo
  var logout = document.getElementById('logoutBtn');
  if (logout) logout.addEventListener('click', function(){ localStorage.removeItem('auth_token'); location.href = '../loginvendedor.html'; });

  // init
  refilter();
})();
