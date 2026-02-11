document.addEventListener('DOMContentLoaded', function () {
  console.log('[login] DOM pronto');

  var form = document.getElementById('loginForm');
  var alertBox = document.getElementById('alert');
  var btn = document.getElementById('submitBtn');
  var btnText = btn ? btn.querySelector('.btn-text') : null;

  // Se loginvendedor.html e dashboard.html estão ambos em /pages:
  var DASHBOARD_PATH = './dashboard.html';

  function showAlert(msg, ok) {
    if (!alertBox) return;
    alertBox.className = 'alert ' + (ok ? 'ok' : 'error');
    alertBox.textContent = msg;
  }
  function clearAlert() {
    if (!alertBox) return;
    alertBox.className = 'alert';
    alertBox.textContent = '';
  }

  if (!form) {
    console.error('[login] #loginForm não encontrado');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('[login] submit acionado');
    clearAlert();

    var emailEl = form.querySelector('#email');
    var passEl = form.querySelector('#password');
    var email = emailEl ? emailEl.value.trim() : '';
    var password = passEl ? passEl.value : '';

    // Validação simples no JS (HTML5 pode bloquear o submit antes do JS se não houver novalidate)
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      showAlert('Informe um e-mail válido.', false);
      if (emailEl) emailEl.focus();
      return;
    }
    if (!password || password.length < 6) {
      showAlert('A senha precisa ter pelo menos 6 caracteres.', false);
      if (passEl) passEl.focus();
      return;
    }

    if (btn) btn.disabled = true;
    if (btnText) btnText.innerHTML = '<span class="spinner" aria-hidden="true"></span> Entrando...';

    // Simulação de login e redirecionamento SEM servidor
    setTimeout(function () {
      showAlert('Login realizado com sucesso!', true);

      // Redireciona de forma simples; se preferir, use new URL(DASHBOARD_PATH, location.href).href
      console.log('[login] redirecionando para', DASHBOARD_PATH);
      window.location.href = DASHBOARD_PATH;
    }, 300);
  });

  // Links (demo)
  var forgot = document.getElementById('forgot');
  if (forgot) forgot.addEventListener('click', function (e) { e.preventDefault(); alert('Recuperação de senha (demo).'); });
  var signup = document.getElementById('signup');
  if (signup) signup.addEventListener('click', function (e) { e.preventDefault(); alert('Cadastro de vendedor (demo).'); });
});
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const btn  = document.getElementById('submitBtn');
  const txt  = btn?.querySelector('.btn-text');
  const alertBox = document.getElementById('alert');

  const DASHBOARD = new URL('./dashboard.html', location.href).href;

  const show = (type, msg) => {
    if (!alertBox) return;
    alertBox.className = 'alert ' + (type === 'error' ? 'error' : 'ok');
    alertBox.textContent = msg;
    alertBox.style.display = 'block';
  };
  const clear = () => { if(alertBox){ alertBox.className='alert'; alertBox.style.display='none'; alertBox.textContent=''; } };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    clear();

    const email = form.email?.value.trim() || '';
    const pass  = form.password?.value || '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { show('error','Informe um e-mail válido.'); form.email?.focus(); return; }
    if (pass.length < 6) { show('error','A senha precisa ter pelo menos 6 caracteres.'); form.password?.focus(); return; }

    btn && (btn.disabled = true);
    txt && (txt.innerHTML = '<span class="spinner" aria-hidden="true"></span> Entrando...');

    // Login "fake" local: guarda token de vendedor
    localStorage.setItem('auth_token', 'mt_vendor_' + Math.random().toString(36).slice(2));
    localStorage.setItem('mt_vendor', JSON.stringify({ email, loggedAt: Date.now() }));

    show('ok','Login realizado com sucesso!');
    // Redireciona para o dashboard do vendedor (sempre dentro de /pages/)
    location.href = DASHBOARD;
  });
});
