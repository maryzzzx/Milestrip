document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('signupForm');
  const alert = document.getElementById('alert');

  const show = (type, msg) => {
    alert.className = 'alert ' + (type === 'error' ? 'error' : 'ok');
    alert.textContent = msg;
    alert.style.display = 'block';
  };
  const clear = () => { alert.className = 'alert'; alert.textContent = ''; alert.style.display = 'none'; };

  const displayNameFromEmail = (mail) => {
    const local = (mail.split('@')[0] || '')
      .replace(/[._-]+/g, ' ')
      .trim()
      .split(' ')
      .map(s => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '')
      .join(' ');
    return local || 'Cliente';
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    clear();

    const email = document.getElementById('semail')?.value.trim() || '';
    const pass  = document.getElementById('spass')?.value || '';
    const conf  = document.getElementById('sconf')?.value || '';
    const terms = document.getElementById('sterms')?.checked || false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { show('error', 'Informe um e-mail válido.'); return; }
    if (pass.length < 6) { show('error', 'A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (pass !== conf) { show('error', 'As senhas não conferem.'); return; }
    if (!terms) { show('error', 'Você precisa aceitar os Termos e a Privacidade.'); return; }

    // “cadastro” local (sem back-end)
    const customer = { email, displayName: displayNameFromEmail(email), createdAt: Date.now() };
    localStorage.setItem('mt_customer', JSON.stringify(customer));
    localStorage.setItem('mt_customer_token', 'ok');

    show('ok', 'Conta criada! Redirecionando…');
    setTimeout(() => {
      // index está na raiz
      window.location.href = '../index.html';
    }, 350);
  });
});
