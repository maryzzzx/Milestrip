document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('vendSignupForm');
  const alert = document.getElementById('alert');

  const show = (type, msg) => {
    alert.className = 'alert ' + (type === 'error' ? 'error' : 'ok');
    alert.textContent = msg;
    alert.style.display = 'block';
  };
  const clear = () => { alert.className = 'alert'; alert.textContent = ''; alert.style.display = 'none'; };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    clear();

    const nome  = document.getElementById('vnome')?.value.trim() || '';
    const email = document.getElementById('vemail')?.value.trim() || '';
    const tel   = document.getElementById('vtel')?.value.trim()   || '';
    const emp   = document.getElementById('vempresa')?.value.trim() || '';
    const pix   = document.getElementById('vpix')?.value.trim()   || '';
    const site  = document.getElementById('vsite')?.value.trim()  || '';
    const pass  = document.getElementById('vpass')?.value || '';
    const conf  = document.getElementById('vconf')?.value || '';
    const terms = document.getElementById('vterms')?.checked || false;

    if (!nome) { show('error','Informe seu nome.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { show('error','E-mail inválido.'); return; }
    if (pass.length < 6) { show('error','A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (pass !== conf) { show('error','As senhas não conferem.'); return; }
    if (!terms) { show('error','Aceite os Termos e a Privacidade.'); return; }

    // “Cadastro” local do vendedor (sem back-end)
    const vendor = {
      nome, email, tel, empresa: emp, pix, site,
      createdAt: Date.now()
    };
    localStorage.setItem('mt_vendor', JSON.stringify(vendor));
    // gera um token simples para o painel
    localStorage.setItem('auth_token', 'mt_vendor_' + Math.random().toString(36).slice(2));

    show('ok', 'Conta criada! Redirecionando para o painel…');
    setTimeout(() => {
      // painel está em /pages/
      window.location.href = './dashboard.html';
    }, 350);
  });
});
