document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // Scroll suave
  // -------------------------------
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    });
  });

  // -------------------------------
  // Botão voltar ao topo
  // -------------------------------
  const toTopBtn = document.getElementById("toTopBtn");
  window.addEventListener("scroll", () => {
    toTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // -------------------------------
  // Carrossel simples
  // -------------------------------
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 4000);

  // -------------------------------
  // Carregar dados do JSON
  // -------------------------------
  fetch("../json/data.json")
    .then(res => res.json())
    .then(data => {
      carregarHorarios(data.horarios);
      carregarMinisterios(data.ministerios);
      carregarSermoes(data.sermoes);
      carregarEventos(data.eventos);
    })
    .catch(err => console.error("Erro ao carregar JSON:", err));

  // -------------------------------
  // Funções para renderizar cada seção
  // -------------------------------
  function carregarHorarios(horarios) {
    const container = document.getElementById("horarios-container");
    horarios.forEach(h => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${h.dia}:</strong> ${h.horario}`;
      container.appendChild(div);
    });
  }

  function carregarMinisterios(ministerios) {
    const container = document.getElementById("ministerios-container");
    ministerios.forEach(min => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="img/${min.imagem}" alt="${min.nome}">
        <h3>${min.nome}</h3>
        <p>${min.descricao}</p>
      `;
      container.appendChild(card);
    });
  }

  function carregarSermoes(sermoes) {
    const container = document.getElementById("sermoes-container");
    sermoes.forEach(sermao => {
      const div = document.createElement("div");
      div.classList.add("sermao");
      div.innerHTML = `
        <img src="img/${sermao.imagem}" alt="${sermao.titulo}">
        <div>
          <h3>${sermao.titulo}</h3>
          <p><strong>Palestrante:</strong> ${sermao.palestrante}</p>
          <p><strong>Categorias:</strong> ${sermao.categorias.join(", ")}</p>
          <p>${sermao.data}</p>
          <button onclick='abrirModalSermao(${JSON.stringify(sermao)})'>Ouvir/Assistir</button>
        </div>
      `;
      container.appendChild(div);
    });
  }

  function carregarEventos(eventos) {
    const container = document.getElementById("eventos-container");
    eventos.forEach(evento => {
      const div = document.createElement("div");
      div.classList.add("evento");
      div.innerHTML = `
        <img src="img/${evento.imagem}" alt="${evento.titulo}">
        <div>
          <h3>${evento.titulo}</h3>
          <p>${evento.dataHora}</p>
          <p>${evento.local}</p>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // -------------------------------
  // Modal (YouTube + MP3 + MP4)
  // -------------------------------
  window.abrirModalSermao = (sermao) => {
    let conteudo = "";

    if (sermao.tipo === "youtube" && sermao.youtubeId) {
      // codifica ID para evitar problemas com & e caracteres especiais
      const youtubeId = encodeURIComponent(sermao.youtubeId);
      conteudo = `
        <iframe width="100%" height="315"
          src="https://www.youtube.com/embed/${youtubeId}?autoplay=1"
          title="${sermao.titulo}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      `;
    } else if (sermao.midia) {
      const ext = sermao.midia.split(".").pop().toLowerCase();
      if (ext === "mp4") {
        conteudo = `<video controls autoplay width="100%"><source src="img/${sermao.midia}" type="video/mp4"></video>`;
      } else if (ext === "mp3") {
        conteudo = `<audio controls autoplay><source src="img/${sermao.midia}" type="audio/mpeg"></audio>`;
      } else {
        conteudo = `<p>Formato de mídia não suportado.</p>`;
      }
    } else {
      conteudo = `<p>Nenhuma mídia disponível.</p>`;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="this.parentElement.parentElement.remove()">×</span>
        ${conteudo}
      </div>
    `;
    document.body.appendChild(modal);
  };

  // -------------------------------
  // Menu hamburguer
  // -------------------------------
  const btn = document.getElementById("hamburger-btn");
  const nav = document.getElementById("nav");

  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

});
