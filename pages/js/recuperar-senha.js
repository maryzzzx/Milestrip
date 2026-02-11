document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('recoverForm');
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

    const email = document.getElementById('rmail')?.value.trim() || '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      show('error', 'Informe um e-mail válido.');
      return;
    }

    // simula envio
    show('ok', 'Se o e-mail estiver cadastrado, enviaremos as instruções em instantes.');
    form.querySelector('button').disabled = true;
    setTimeout(() => {
      window.location.href = './login.html';
    }, 3000);
  });
});
