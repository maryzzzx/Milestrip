// main.js — painel + (opcional) cabeçalho do cliente
(function () {
  // ==== Util: nome de exibição a partir do e-mail (para o index) ====
  function displayNameFromEmail(mail) {
    const local = (mail?.split('@')[0] || '')
      .replace(/[._-]+/g, ' ')
      .trim()
      .split(' ')
      .map(s => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : ''))
      .join(' ');
    return local || 'Cliente';
  }

  // ==== LOGOUT UNIVERSAL (Vendedor) ====
  // Obs.: Suas páginas do painel estão em /pages/, e o login do vendedor também (loginvendedor.html).
  // Portanto o caminho correto é "./loginvendedor.html".
  window.logout = function logout() {
    console.log('[logout] disparado');
    // limpe só o que precisar
    localStorage.removeItem('auth_token');
    // localStorage.removeItem('mt_settings_v1');
    // localStorage.removeItem('mt_clients_v1');
    // localStorage.removeItem('mt_packages_v1');

    // redireciona para o login do vendedor (dentro de /pages/)
    window.location.href = './loginvendedor.html';
  };

  function wireLogout() {
    const el = document.getElementById('logoutBtn');
    if (!el) {
      // tudo bem: algumas páginas podem não ter o botão
      return;
    }
    // remove possíveis listeners duplicados
    el.replaceWith(el.cloneNode(true));
    const btn = document.getElementById('logoutBtn');
    // garanta que não submeta formulário
    if (btn && !btn.getAttribute('type')) btn.setAttribute('type', 'button');
    btn?.addEventListener('click', (e) => {
      e.preventDefault?.();
      e.stopPropagation?.();
      window.logout();
    });
    console.log('[logout] ligado em #logoutBtn');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireLogout);
  } else {
    wireLogout();
  }

  // Delegação (caso o botão seja recriado dinamicamente)
  document.addEventListener('click', (e) => {
    const t = e.target.closest?.('#logoutBtn');
    if (t) {
      e.preventDefault?.();
      window.logout();
    }
  });

  // ==== (Opcional) Cabeçalho do cliente no index.html ====
  // Se você decidir carregar ESTE MESMO arquivo no index.html (raiz),
  // ele vai preencher "Olá, {nome}" usando o e-mail salvo no login geral.
  function wireClientHeader() {
    const greet = document.getElementById('clientGreeting');
    const btn   = document.getElementById('clientLogout');
    if (!greet && !btn) return; // nada a fazer no painel

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireClientHeader);
  } else {
    wireClientHeader();
  }
})();
