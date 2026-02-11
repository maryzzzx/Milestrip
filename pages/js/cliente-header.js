
document.addEventListener('DOMContentLoaded', () => {
  const greet = document.getElementById('clientGreeting');
  const btn   = document.getElementById('clientLogout');

  const displayNameFromEmail = (mail) => {
    const local = (mail?.split('@')[0] || '')
      .replace(/[._-]+/g, ' ')
      .trim()
      .split(' ')
      .map(s => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '')
      .join(' ');
    return local || 'Cliente';
  };

  try {
    const raw = localStorage.getItem('mt_customer');
    if (raw) {
      const c = JSON.parse(raw);
      const name = c.displayName || displayNameFromEmail(c.email || '');
      if (greet) greet.textContent = `Olá, ${name}`;
    }
  } catch {}

  btn?.addEventListener('click', () => {
    localStorage.removeItem('mt_customer');
    localStorage.removeItem('mt_customer_token');
    if (greet) greet.textContent = 'Olá, visitante';
  });
});
