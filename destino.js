// destino.js — versão robusta para corresponder slugs com e sem acento/hífens

// ===== Dados dos destinos (exemplo com suas 8 localidades) =====
const destinos = {
  "pacote-cancun-all-inclusive": {
    nome: "Cancún All Inclusive",
    descricao: "Tudo incluso em Cancún: praias, resorts e descanso garantido.",
    idioma: "Espanhol",
    moeda: "Peso Mexicano (MXN)",
    fuso: "GMT-5",
    epoca: "Novembro a Abril",
    imagem: "./assets/cancun.jpg",
    pacotes: [
      { cidade: "São Paulo", preco: 4800 },
      { cidade: "Rio de Janeiro", preco: 5000 },
    ],
  },
  "paris-romantica-7-dias": {
    nome: "Paris Romântica",
    descricao: "Vivencie a cidade-luz com passeios clássicos e experiências gastronômicas.",
    idioma: "Francês",
    moeda: "Euro (€)",
    fuso: "GMT+1",
    epoca: "Abril a Junho / Setembro a Outubro",
    imagem: "./assets/paris.png",
    pacotes: [
      { cidade: "São Paulo", preco: 7200 },
      { cidade: "Brasília", preco: 7600 },
    ],
  },
  "nova-york-experience": {
    nome: "Nova York Experience",
    descricao: "A cidade que nunca dorme — arte, gastronomia e cultura 24/7.",
    idioma: "Inglês",
    moeda: "Dólar (US$)",
    fuso: "GMT-5",
    epoca: "Abril a Junho / Setembro a Novembro",
    imagem: "./assets/newyork.jpg",
    pacotes: [
      { cidade: "São Paulo", preco: 6100 },
      { cidade: "Rio de Janeiro", preco: 6400 },
    ],
  },
  "toquio-cultural": {
    nome: "Tóquio Cultural",
    descricao: "Tradição e tecnologia se encontram na capital japonesa.",
    idioma: "Japonês",
    moeda: "Iene (¥)",
    fuso: "GMT+9",
    epoca: "Março a Maio / Setembro a Novembro",
    imagem: "./assets/tokyo.jpg",
    pacotes: [
      { cidade: "São Paulo", preco: 8900 },
      { cidade: "Rio de Janeiro", preco: 8700 },
    ],
  },
  "roma-classica": {
    nome: "Roma Clássica",
    descricao: "História, arte e gastronomia em cada esquina.",
    idioma: "Italiano",
    moeda: "Euro (€)",
    fuso: "GMT+1",
    epoca: "Abril a Junho / Setembro a Outubro",
    imagem: "./assets/rome.jpg",
    pacotes: [
      { cidade: "São Paulo", preco: 5400 },
      { cidade: "Brasília", preco: 5600 },
    ],
  },
  "oslo-experience": {
    nome: "Oslo Experience",
    descricao: "Design, natureza e qualidade de vida na Noruega.",
    idioma: "Norueguês",
    moeda: "Coroa Norueguesa (NOK)",
    fuso: "GMT+1",
    epoca: "Junho a Agosto",
    imagem: "./assets/oslo.png",
    pacotes: [
      { cidade: "São Paulo", preco: 8000 },
      { cidade: "Rio de Janeiro", preco: 9800 },
    ],
  },
  "buenos-aires-experience": {
    nome: "Buenos Aires Experience",
    descricao: "Tango, parrilla e vida cultural apaixonante.",
    idioma: "Espanhol",
    moeda: "Peso Argentino (ARS)",
    fuso: "GMT-3",
    epoca: "Setembro a Novembro / Março a Maio",
    imagem: "./assets/buenosaires.jpg",
    pacotes: [
      { cidade: "São Paulo", preco: 4600 },
      { cidade: "Rio de Janeiro", preco: 4700 },
    ],
  },
  "santiago-experience": {
    nome: "Santiago Experience",
    descricao: "Porta de entrada para o Chile: vinhos, montanhas e cultura urbana.",
    idioma: "Espanhol",
    moeda: "Peso Chileno (CLP)",
    fuso: "GMT-4",
    epoca: "Setembro a Novembro / Março a Maio",
    imagem: "./assets/santiago.png",
    pacotes: [
      { cidade: "São Paulo", preco: 4190 },
      { cidade: "Rio de Janeiro", preco: 4290 },
    ],
  },
};

// ===== Função utilitária para gerar slug (idem ao do script.js) =====
function gerarSlug(nome) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

// ===== Pega o parâmetro 'cidade' da URL =====
const params = new URLSearchParams(window.location.search);
const slugUrl = params.get("cidade");

function mostrarPlaceholder() {
  // Se não encontrou destino, deixa o placeholder (conteúdo já no HTML)
  console.warn("destino.js: nenhum destino encontrado para:", slugUrl);
  // opcional: você pode exibir uma mensagem amigável no DOM aqui
}

// ===== Tenta localizar o destino de forma robusta =====
let destinoEncontrado = null;

if (slugUrl) {
  // 1) tenta achar direto por chave (caso você tenha chaves iguais ao slug)
  if (destinos[slugUrl]) {
    destinoEncontrado = destinos[slugUrl];
  } else {
    // 2) tenta comparar o slug gerado a partir do nome de cada destino
    for (const key in destinos) {
      if (Object.prototype.hasOwnProperty.call(destinos, key)) {
        const d = destinos[key];
        const slugFromNome = gerarSlug(d.nome);
        if (slugFromNome === slugUrl) {
          destinoEncontrado = d;
          break;
        }
      }
    }
  }
}

// ===== Se encontrou, popula a página =====
if (destinoEncontrado) {
  console.log("destino.js: destino encontrado:", destinoEncontrado.nome);

  // Títulos e textos
  const tituloEl = document.getElementById("destinoTitulo");
  const descricaoEl = document.getElementById("destinoDescricao");
  const nomeEl = document.getElementById("destinoNome");
  const idiomaEl = document.getElementById("idioma");
  const moedaEl = document.getElementById("moeda");
  const fusoEl = document.getElementById("fuso");
  const epocaEl = document.getElementById("epoca");
  const pacotesContainer = document.getElementById("pacotesContainer");
  const pacotesTitulo = document.getElementById("destinoPacotesTitulo");
  const textoEl = document.getElementById("destinoTexto");

  if (tituloEl) tituloEl.innerHTML = `Descubra <span class="grifo">${destinoEncontrado.nome}</span>`;
  if (descricaoEl) descricaoEl.textContent = destinoEncontrado.descricao;
  if (nomeEl) nomeEl.textContent = destinoEncontrado.nome;
  if (idiomaEl) idiomaEl.textContent = destinoEncontrado.idioma;
  if (moedaEl) moedaEl.textContent = destinoEncontrado.moeda;
  if (fusoEl) fusoEl.textContent = destinoEncontrado.fuso;
  if (epocaEl) epocaEl.textContent = destinoEncontrado.epoca;
  if (pacotesTitulo) pacotesTitulo.textContent = destinoEncontrado.nome;
  if (textoEl) {
  textoEl.textContent = `${destinoEncontrado.nome} é um destino que combina história, modernidade e experiências únicas. Conheça os principais pontos turísticos, mergulhe na cultura local e viva momentos inesquecíveis.`;
}

  // altera imagem do hero (caso exista)
  const hero = document.querySelector(".destino-hero");
  if (hero && destinoEncontrado.imagem) {
    hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url('${destinoEncontrado.imagem}')`;
  }

  // renderiza pacotes
  if (pacotesContainer) {
    pacotesContainer.innerHTML = ""; // limpa
    destinoEncontrado.pacotes.forEach((p) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-content">
          <h3>Saindo de ${p.cidade}</h3>
          <p>A partir de <strong>R$ ${p.preco.toLocaleString("pt-BR")}</strong></p>
          <button class="cta ghost reservar" data-destino="${gerarSlug(destinoEncontrado.nome)}" data-origem="${gerarSlug(p.cidade)}">Reservar agora</button>
        </div>
      `;
      pacotesContainer.appendChild(card);
    });
  }
} else {
  // não encontrou destino
  mostrarPlaceholder();
}

// atualiza ano no footer (segurança: verifica elemento)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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