// Login de cliente: apenas e-mail + senha. Redireciona para ../index.html
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clientLoginForm');
  const alertBox = document.getElementById('alert');

  const show = (type, msg) => {
    alertBox.className = 'alert ' + (type === 'error' ? 'error' : 'ok');
    alertBox.textContent = msg;
    alertBox.style.display = 'block';
  };
  const clear = () => { alertBox.className = 'alert'; alertBox.textContent=''; alertBox.style.display='none'; };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    clear();

    const email = document.getElementById('cemail')?.value.trim() || '';
    const pass  = document.getElementById('cpass')?.value || '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { show('error','Informe um e-mail válido.'); return; }
    if (pass.length < 6) { show('error','A senha precisa ter pelo menos 6 caracteres.'); return; }

    // “login” local do cliente (sem back-end)
    localStorage.setItem('mt_customer', JSON.stringify({ email, loggedAt: Date.now() }));
    localStorage.setItem('mt_customer_token', 'ok');

    show('ok', 'Login realizado! Redirecionando...');
    setTimeout(() => {
      window.location.href = '../index.html'; // index está na raiz
    }, 250);
    
  });
});
