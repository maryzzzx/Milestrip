
// Configurações — salva em LocalStorage (demo), troca de avatar e validações simples
(function(){
  const $ = (id) => document.getElementById(id);
  const LS_KEY = 'mt_settings_v1';

  // Campos
  const fNome=$('fNome'), fEmail=$('fEmail'), fTelefone=$('fTelefone'), fBio=$('fBio');
  const pTema=$('pTema'), pLang=$('pLang'), nEmail=$('nEmail'), nPush=$('nPush'), nPromo=$('nPromo');
  const payPix=$('payPix'), payBanco=$('payBanco'), payAgencia=$('payAgencia'), payConta=$('payConta'), payFav=$('payFav');
  const sAtual=$('sAtual'), sNova=$('sNova'), sConf=$('sConf'), s2FA=$('s2FA');
  const btnChangePass=$('btnChangePass');
  const saveAll=$('saveAll'), resetSettings=$('resetSettings'), exportSettings=$('exportSettings'), importFile=$('importFile');
  const avatarInput=$('avatarInput'), avatarPreview=$('avatarPreview');

  // Toast simples
  let toast; function notify(msg){
    if(!toast){ toast = document.createElement('div'); toast.className='toast'; document.body.appendChild(toast); }
    toast.textContent = msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), 2200);
  }

  function load(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw){
        const def = {
          perfil:{ nome:'', email:'', telefone:'', bio:'', avatar:'' },
          pref:{ tema:'dark', lang:'pt-BR', nEmail:true, nPush:false, nPromo:true },
          pay:{ pix:'', banco:'', agencia:'', conta:'', fav:'' },
          sec:{ twoFA:false }
        };
        localStorage.setItem(LS_KEY, JSON.stringify(def));
        return def;
      }
      return JSON.parse(raw);
    }catch(e){ console.error('[config] load', e); return {}; }
  }
  function save(state){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }

  let state = load();

  function applyToUI(){
    // perfil
    fNome.value = state.perfil.nome||''; fEmail.value=state.perfil.email||''; fTelefone.value=state.perfil.telefone||''; fBio.value=state.perfil.bio||'';
    if(state.perfil.avatar){ avatarPreview.src = state.perfil.avatar; } else { avatarPreview.src=''; }
    // pref
    pTema.value = state.pref.tema||'dark'; document.body.classList.toggle('light', state.pref.tema==='light');
    pLang.value = state.pref.lang||'pt-BR';
    nEmail.checked = !!state.pref.nEmail; nPush.checked=!!state.pref.nPush; nPromo.checked=!!state.pref.nPromo;
    // pay
    payPix.value=state.pay.pix||''; payBanco.value=state.pay.banco||''; payAgencia.value=state.pay.agencia||''; payConta.value=state.pay.conta||''; payFav.value=state.pay.fav||'';
    // sec
    s2FA.checked = !!state.sec.twoFA;
  }

  function collectFromUI(){
    state.perfil.nome = fNome.value.trim();
    state.perfil.email = fEmail.value.trim();
    state.perfil.telefone = fTelefone.value.trim();
    state.perfil.bio = fBio.value.trim();
    // pref
    state.pref.tema = pTema.value; state.pref.lang=pLang.value; state.pref.nEmail=nEmail.checked; state.pref.nPush=nPush.checked; state.pref.nPromo=nPromo.checked;
    // pay
    state.pay.pix=payPix.value.trim(); state.pay.banco=payBanco.value.trim(); state.pay.agencia=payAgencia.value.trim(); state.pay.conta=payConta.value.trim(); state.pay.fav=payFav.value.trim();
    // sec
    state.sec.twoFA = s2FA.checked;
  }

  // Avatar preview (base64 para demo)
  avatarInput?.addEventListener('change', (e)=>{
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ avatarPreview.src = reader.result; state.perfil.avatar = String(reader.result); save(state); notify('Avatar atualizado'); };
    reader.readAsDataURL(file);
  });

  // Salvar tudo
  saveAll?.addEventListener('click', ()=>{ collectFromUI(); save(state); notify('Configurações salvas'); });

  // Reset
  resetSettings?.addEventListener('click', ()=>{
    if(confirm('Restaurar configurações padrão?')){
      localStorage.removeItem(LS_KEY); state = load(); applyToUI(); notify('Configurações restauradas');
    }
  });

  // Exportar
  exportSettings?.addEventListener('click', ()=>{
    collectFromUI();
    const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'configuracoes.json'; a.click(); URL.revokeObjectURL(a.href);
  });

  // Importar
  importFile?.addEventListener('change', (e)=>{
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader(); reader.onload = ()=>{
      try{ const obj = JSON.parse(reader.result); state = obj; save(state); applyToUI(); notify('Configurações importadas'); }
      catch(err){ alert('Arquivo inválido.'); }
    }; reader.readAsText(file);
  });

  // Tema ao trocar
  pTema?.addEventListener('change', ()=>{ document.body.classList.toggle('light', pTema.value==='light'); });

  // Alterar senha (demo)
  btnChangePass?.addEventListener('click', ()=>{
    const nova = sNova.value, conf = sConf.value;
    if((nova?.length||0) < 6){ alert('A nova senha precisa ter pelo menos 6 caracteres.'); return; }
    if(nova !== conf){ alert('As senhas não conferem.'); return; }
    // Somente demo: não envia ao servidor
    sAtual.value = sNova.value = sConf.value = '';
    notify('Senha alterada (demo)');
  });

  // Logout demo
  document.getElementById('logoutBtn')?.addEventListener('click', ()=>{
    localStorage.removeItem('auth_token');
    location.href = '../loginvendedor.html';
  });

  // Init
  applyToUI();
})();

// Sidebar toggle (mobile)
  const aside = document.querySelector('.sidebar');
  document.getElementById('menuToggle')?.addEventListener('click', ()=> aside?.classList.toggle('open'));
  document.addEventListener('click',(e)=>{
    if (window.innerWidth>768) return;
    if (!aside?.classList.contains('open')) return;
    if (!e.target.closest('.sidebar') && !e.target.closest('#menuToggle')) aside.classList.remove('open');
  });

