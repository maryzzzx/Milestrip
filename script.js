// =============================
//  MILES TRIP — JAVASCRIPT
// =============================

// Produtos simulados (poderia vir de uma API futuramente)
const produtos = [
  { id: 1, nome: "Pacote Cancún All Inclusive", preco: 4800, imagem: "./assets/cancun.jpg" },
  { id: 2, nome: "Paris Romântica 7 dias", preco: 7200, imagem: "./assets/paris.png" },
  { id: 3, nome: "Nova York Experience", preco: 6100, imagem: "./assets/newyork.jpg" },
  { id: 4, nome: "Tóquio Cultural", preco: 8900, imagem: "./assets/tokyo.jpg" },
  { id: 5, nome: "Roma Clássica", preco: 5400, imagem: "./assets/rome.jpg" },
  { id: 6, nome: "Oslo Experience", preco: 8000, imagem: "./assets/oslo.png" },
  { id: 7, nome: "Buenos Aires Experience", preco: 4600, imagem: "./assets/buenosaires.jpg" },
  { id: 8, nome: "Santiago Experience", preco: 4190, imagem: "./assets/santiago.png" },
];

// =============================
//  FUNÇÃO GERADORA DE SLUGS
// =============================
// Transforma o nome do produto em uma slug segura para URL (ex: "Tóquio Cultural" → "toquio-cultural")
function gerarSlug(nome) {
  return nome
    .normalize("NFD")                 // remove acentos
    .replace(/[\u0300-\u036f]/g, "")  // remove diacríticos
    .toLowerCase()
    .replace(/\s+/g, "-")             // espaços -> hífen
    .replace(/[^\w-]+/g, "");         // remove caracteres especiais
}

// =============================
//  CARROSSEL
// =============================
const track = document.querySelector('.carousel-track');
const slides = Array.from(track?.children || []);
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');
let currentIndex = 0;

function updateSlide() {
  if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

nextButton?.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlide();
});

prevButton?.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlide();
});

// =============================
//  RENDERIZAÇÃO DE PRODUTOS
// =============================
const grid = document.getElementById("productGrid");

if (grid) {
  produtos.forEach((p) => {
    const slug = gerarSlug(p.nome);
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="card-content">
        <h3>${p.nome}</h3>
        <p>A partir de <strong>R$ ${p.preco.toLocaleString("pt-BR")}</strong></p>
        <a href="destino.html?cidade=${slug}" class="cta ghost">Saiba mais</a>
        <button class="cta add-to-cart" data-id="${p.id}">Adicionar ao carrinho</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// =============================
//  CARRINHO DE COMPRAS
// =============================
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");

function atualizarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  if (cartCount) cartCount.textContent = carrinho.length;
  renderCarrinho();
}

function renderCarrinho() {
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let subtotal = 0;

  carrinho.forEach((item) => {
    const produto = produtos.find((p) => p.id === item.id);
    if (!produto) return;

    subtotal += produto.preco;

    const li = document.createElement("div");
    li.classList.add("cart-item");
    li.style.borderBottom = "1px solid var(--border)";
    li.style.padding = "0.5rem 0";

    li.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <strong>${produto.nome}</strong><br>
          <small class="muted">R$ ${produto.preco.toLocaleString("pt-BR")}</small>
        </div>
        <button class="cta ghost remove-item" data-id="${produto.id}">Remover</button>
      </div>
    `;
    cartItems.appendChild(li);
  });

  const desconto = subtotal * 0.1;
  const total = subtotal - desconto;

  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  if (discountEl) discountEl.textContent = `- R$ ${desconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  if (totalEl) totalEl.textContent = `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

// =============================
//  MODO ESCURO/CLARO
// =============================
const botao = document.getElementById('modo-toggle');
botao?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  botao.textContent = document.body.classList.contains('dark-mode')
    ? '☀️ Modo claro'
    : '🌙 Modo escuro';
});

// =============================
//  EVENTOS DO CARRINHO
// =============================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = Number(e.target.dataset.id);
    if (!carrinho.find((item) => item.id === id)) {
      carrinho.push({ id });
      atualizarCarrinho();
    }
  }

  if (e.target.classList.contains("remove-item")) {
    const id = Number(e.target.dataset.id);
    carrinho = carrinho.filter((i) => i.id !== id);
    atualizarCarrinho();
  }
});

document.getElementById("openCart")?.addEventListener("click", () => {
  cartDrawer.classList.add("active");
});
document.getElementById("closeCart")?.addEventListener("click", () => {
  cartDrawer.classList.remove("active");
});

// =============================
//  NEWSLETTER
// =============================
document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.querySelector("input").value;
  alert(`Obrigado! ${email} foi cadastrado em nossa lista VIP ✈️`);
  e.target.reset();
});

// =============================
//  ANO AUTOMÁTICO
// =============================
document.getElementById("year").textContent = new Date().getFullYear();

// =============================
//  INICIALIZAÇÃO
// =============================
atualizarCarrinho();
// =============================
// Carrossel novo
// =============================
// universal carousel (controls any .carousel-track)

document.querySelectorAll('.carousel-track').forEach(track => {
  const slides = Array.from(track.children);
  const container = track.closest('.promo-carousel, .hero-carousel, .carousel');
  const nextButton = container.querySelector('.carousel-btn.next');
  const prevButton = container.querySelector('.carousel-btn.prev');
  let currentIndex = 0;

  function updateSlide() { track.style.transform = `translateX(-${currentIndex * 100}%)`; }

  nextButton?.addEventListener('click', () => { currentIndex = (currentIndex + 1) % slides.length; updateSlide(); });
  prevButton?.addEventListener('click', () => { currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateSlide(); });

  // optional auto-play
  setInterval(() => { currentIndex = (currentIndex + 1) % slides.length; updateSlide(); }, 6000);
});
 (function(){
    const launcher = document.getElementById('chat-launcher');
    const widget   = document.getElementById('chat-widget');
    const closeBtn = document.getElementById('chat-close');
    const form     = document.getElementById('chat-form');
    const input    = document.getElementById('chat-text');
    const body     = document.getElementById('chat-body');

    function openChat(){
      widget.hidden = false;
      launcher.setAttribute('aria-expanded','true');
      input.focus();
    }
    function closeChat(){
      widget.hidden = true;
      launcher.setAttribute('aria-expanded','false');
      launcher.focus();
    }

    launcher.addEventListener('click', ()=>{
      if(widget.hidden) openChat(); else closeChat();
    });
    closeBtn.addEventListener('click', closeChat);

    // Fecha com ESC
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && !widget.hidden){ closeChat(); }
    });

    // Envio fake local (você pode integrar sua API/chat real aqui)
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const text = input.value.trim();
      if(!text) return;

      // mensagem do usuário
      appendMsg('user', text);
      input.value = '';

      // resposta automática (placeholder)
      setTimeout(()=>{
        appendMsg('bot', 'Recebemos sua mensagem! Um de nossos especialistas responderá em instantes. 😊');
        body.scrollTop = body.scrollHeight;
      }, 600);
    });

    function appendMsg(who, text){
      const wrap = document.createElement('div');
      wrap.className = `msg ${who}`;
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      if(who === 'bot'){
        const av = document.createElement('div');
        av.className = 'avatar mini';
        wrap.appendChild(av);
        wrap.appendChild(bubble);
      } else {
        wrap.appendChild(bubble);
      }
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }
  })();