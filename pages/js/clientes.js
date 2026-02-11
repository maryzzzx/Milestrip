// pages/js/clientes.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('[clientes] DOM pronto');

  // ---- Referências
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const tbody      = $('#clientsBody');
  const search     = $('#searchClient');
  const sortBy     = $('#sortBy');
  const exportBtn  = $('#exportClients');
  const addBtn     = $('#addClient');
  const clearAllBtn= $('#clearAll');

  // Modal
  const backdrop   = $('#modalBackdrop');
  const titleEl    = $('#modalTitle');
  const mNome      = $('#mNome');
  const mEmail     = $('#mEmail');
  const mTel       = $('#mTel');
  const mUltima    = $('#mUltima');
  const mTotal     = $('#mTotal');
  const closeModalBtn  = $('#closeModal');
  const cancelModalBtn = $('#cancelModal');
  const saveClientBtn  = $('#saveClient');
  const deleteClientBtn= $('#deleteClient');

  if (!tbody) { console.error('[clientes] tbody #clientsBody não encontrado.'); return; }

  // ---- Storage
  const LS_KEY = 'mt_clients_v1';

  const SEED = [
    { id: 1, nome:'Ana Souza',   email:'ana@email.com',   tel:'(11) 99999-0001', ultima:'2025-10-10', total:4200 },
    { id: 2, nome:'Bruno Lima',  email:'bruno@email.com', tel:'(21) 98888-2222', ultima:'2025-10-05', total:1800 },
    { id: 3, nome:'Carla Mendes',email:'carla@email.com', tel:'(31) 97777-3333', ultima:'2025-11-02', total:2600 },
  ];

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        console.warn('[clientes] sem dados — aplicando SEED');
        localStorage.setItem(LS_KEY, JSON.stringify(SEED));
        return [...SEED];
      }
      const data = JSON.parse(raw);
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('[clientes] dados inválidos/vazios — aplicando SEED');
        localStorage.setItem(LS_KEY, JSON.stringify(SEED));
        return [...SEED];
      }
      return data;
    } catch (e) {
      console.error('[clientes] erro ao carregar, aplicando SEED', e);
      localStorage.setItem(LS_KEY, JSON.stringify(SEED));
      return [...SEED];
    }
  }

  function save() {
    localStorage.setItem(LS_KEY, JSON.stringify(clients));
  }

  let clients = load();
  let editingId = null;

  // ---- Utilitários
  const money   = (v) => Number(v||0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  const toBR    = (iso) => iso ? new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR') : '';
  const toISO   = (d) => { const t = d?.split('/'); return (t && t.length === 3) ? `${t[2]}-${t[1]}-${t[0]}` : d; };

  function render(data) {
    tbody.innerHTML = data.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>${c.email}</td>
        <td>${c.tel}</td>
        <td>${toBR(c.ultima)}</td>
        <td>${money(c.total)}</td>
        <td>
          <button class="btn small" data-edit="${c.id}">Editar</button>
          <button class="btn small danger" data-del="${c.id}">Excluir</button>
        </td>
      </tr>
    `).join('');
  }

  function refilter() {
    const term = (search?.value || '').toLowerCase();
    let data = clients.filter(c =>
      c.nome.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.tel||'').toLowerCase().includes(term)
    );

    if (sortBy) {
      const [field, dir] = (sortBy.value || 'nome-asc').split('-');
      const mul = dir === 'asc' ? 1 : -1;
      data.sort((a,b) => {
        if(field === 'nome')   return a.nome.localeCompare(b.nome) * mul;
        if(field === 'total')  return (Number(a.total) - Number(b.total)) * mul;
        if(field === 'ultima') return (new Date(a.ultima) - new Date(b.ultima)) * mul;
        return 0;
      });
    }

    render(data);
  }

  // ---- Modal helpers
  function openModal(id) {
    editingId = id ?? null;
    if (editingId) {
      titleEl.textContent = 'Editar cliente';
      const c = clients.find(x => x.id === editingId);
      mNome.value   = c?.nome   || '';
      mEmail.value  = c?.email  || '';
      mTel.value    = c?.tel    || '';
      mUltima.value = c?.ultima || new Date().toISOString().slice(0,10);
      mTotal.value  = c?.total  || 0;
      if (deleteClientBtn) deleteClientBtn.style.display = 'inline-flex';
    } else {
      titleEl.textContent = 'Novo cliente';
      mNome.value = mEmail.value = mTel.value = '';
      mUltima.value = new Date().toISOString().slice(0,10);
      mTotal.value = 0;
      if (deleteClientBtn) deleteClientBtn.style.display = 'none';
    }
    if (backdrop) backdrop.style.display = 'flex';
  }
  function closeModal() {
    if (backdrop) backdrop.style.display = 'none';
  }

  // ---- Eventos
  addBtn?.addEventListener('click', () => openModal(null));
  closeModalBtn?.addEventListener('click', closeModal);
  cancelModalBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

  tbody.addEventListener('click', (e) => {
    const editId = e.target.getAttribute('data-edit');
    const delId  = e.target.getAttribute('data-del');
    if (editId) openModal(Number(editId));
    if (delId) {
      const id = Number(delId);
      if (confirm('Deseja excluir este cliente?')) {
        clients = clients.filter(c => c.id !== id);
        save();
        refilter();
      }
    }
  });

  saveClientBtn?.addEventListener('click', () => {
    const nome   = mNome.value.trim();
    const email  = mEmail.value.trim();
    const tel    = mTel.value.trim();
    const ultima = mUltima.value;          // formato ISO yyyy-mm-dd
    const total  = Number(mTotal.value||0);

    if (!nome) { alert('Informe o nome.'); mNome.focus(); return; }

    if (editingId) {
      clients = clients.map(c => c.id === editingId ? {...c, nome, email, tel, ultima, total} : c);
    } else {
      const nextId = clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1;
      clients.push({ id: nextId, nome, email, tel, ultima, total });
    }
    save();
    closeModal();
    refilter();
  });

  search?.addEventListener('input', refilter);
  sortBy?.addEventListener('change', refilter);

  clearAllBtn?.addEventListener('click', () => {
    if (confirm('Isto apagará todos os clientes salvos localmente. Continuar?')) {
      clients = [];
      save();
      refilter();
    }
  });

  exportBtn?.addEventListener('click', () => {
    const header = ['ID','Nome','E-mail','Telefone','Última Compra','Total Gasto'];
    const rows   = clients.map(c => [c.id, c.nome, c.email, c.tel, toBR(c.ultima), money(c.total)]);
    const csv    = [header, ...rows].map(r => r.join(';')).join('\n');
    const blob   = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const a      = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'clientes.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });



  // ---- Inicializa
  refilter();
  console.log('[clientes] renderizado', { total: clients.length, clients });
});
