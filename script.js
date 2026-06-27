const chapters = [
  {
    id: "crianca-carmesin",
    number: "Capítulo I",
    title: "A Criança Carmesin",
    world: "Reino de Elaris",
    description:
      "Julia Polli nasce sob a sombra de uma ordem secreta ligada à Coroa. Treinada para ser instrumento político, ela recebe uma missão que aponta para Valtor e para Igor José Farias, herdeiro da Linhagem Prata.",
    folder: "Capitulos/Capitulo-01/web",
    pages: 20,
    extension: "jpg",
    format: "HQ",
    tone: "Elaris",
  },
  {
    id: "capitulo-02",
    number: "Capítulo II",
    title: "Valtor",
    world: "Sul",
    description: "O nascimento das grandes muralhas, o nascimento de uma tradição, o nascimento de VALTOR.",
    folder: "Capitulos/Capitulo-02/web/",
    pages: 19,
    extension: "jpg",
    format: "HQ",
    tone: "Valtor",
  },
  {
    id: "capitulo-03",
    number: "Capítulo III",
    title: "A noite é dos Pratas",
    world: "Valtor",
    description: "Igor após 5 anos de idade começa o treinamento com o prata vigente Godric Farias, mas é muito dificil agradar os mais fortes",
    folder: "Capitulos/Capitulo-03/web/",
    pages: 30,
    extension: "jpg",
    format: "HQ",
    tone: "Valtor",
  },
  {
    id: "capitulo-04",
    number: "Capítulo IV",
    title: "A ordem",
    world: "Valtor",
    description: "Após Igor derrotar 3 soldados veteranos juntos, Alexander o convoca para uma ordem secreta onde aprende a ser uma arma para o reino",
    folder: "Capitulos/Capitulo-04/web/",
    pages: 13,
    extension: "jpg",
    format: "HQ",
    tone: "Valtor",
  },
  {
    id: "capitulo-05",
    number: "Capítulo V",
    title: "Entre flores e máscaras",
    world: "Valtor",
    description: "Igor completa a primeira missão com sucesso utilizando tatica, e Julia consegue entrar em Valtor, mas ela é percebida por alguém muito importante",
    folder: "Capitulos/Capitulo-05/web/",
    pages: 35,
    extension: "jpg",
    format: "HQ",
    tone: "Valtor",
  },
  {
    id: "capitulo-06",
    number: "Capítulo VI",
    title: "A torre Sul",
    world: "Valtor",
    description: "Julia começa a verdadeira missão, mas as coisas não ocorrem como deviam",
    folder: "Capitulos/Capitulo-06/",
    pages: 20,
    extension: "jpg",
    format: "HQ",
    tone: "Valtor",
  },
  /*
  Para adicionar um novo capítulo, copie este modelo e ajuste os campos:
  {
    id: "capitulo-02",
    number: "Capítulo II",
    title: "Nome do capítulo",
    world: "Local ou arco",
    description: "Resumo curto exibido no topo do leitor.",
    folder: "Capitulos/Capitulo-02",
    pages: 18,
    extension: "png",
    format: "HQ",
    tone: "Valtor",
  },
  */
];

let currentChapter = chapters[0];
let currentPage = 1;
let thumbnailsBuiltFor = "";
let scrollReaderBuiltFor = "";
const preloadedPages = new Set();

const brandTitle = document.querySelector("#brandTitle");
const brandSubtitle = document.querySelector("#brandSubtitle");
const chapterWorld = document.querySelector("#chapterWorld");
const chapterTitle = document.querySelector("#chapterTitle");
const chapterDescription = document.querySelector("#chapterDescription");
const chapterPages = document.querySelector("#chapterPages");
const chapterFormat = document.querySelector("#chapterFormat");
const chapterTone = document.querySelector("#chapterTone");
const chapterList = document.querySelector("#chapterList");
const image = document.querySelector("#comicImage");
const pageLabel = document.querySelector("#pageLabel");
const modeLabel = document.querySelector("#modeLabel");
const progressBar = document.querySelector("#progressBar");
const pageRange = document.querySelector("#pageRange");
const prevPage = document.querySelector("#prevPage");
const nextPage = document.querySelector("#nextPage");
const firstPage = document.querySelector("#firstPage");
const lastPage = document.querySelector("#lastPage");
const toggleIndex = document.querySelector("#toggleIndex");
const closeIndex = document.querySelector("#closeIndex");
const drawerBackdrop = document.querySelector("#drawerBackdrop");
const indexDrawer = document.querySelector("#indexDrawer");
const thumbGrid = document.querySelector("#thumbGrid");
const toggleMode = document.querySelector("#toggleMode");
const fullscreenButton = document.querySelector("#fullscreenButton");
const scrollReader = document.querySelector("#scrollReader");

function pageSrc(chapter, page) {
  const folder = chapter.folder.replace(/\/+$/, "");
  return `${folder}/${page}.${chapter.extension}`;
}

function chapterName(chapter) {
  return `${chapter.number} — ${chapter.title}`;
}

function clampPage(page) {
  return Math.min(currentChapter.pages, Math.max(1, page));
}

function setPage(page, shouldScroll = false) {
  currentPage = clampPage(page);
  image.src = pageSrc(currentChapter, currentPage);
  image.decoding = "async";
  image.alt = `Página ${currentPage} de ${chapterName(currentChapter)}`;
  pageLabel.textContent = `Página ${currentPage} de ${currentChapter.pages}`;
  pageRange.value = String(currentPage);
  progressBar.style.width = `${(currentPage / currentChapter.pages) * 100}%`;
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === currentChapter.pages;

  document.querySelectorAll(".thumb-button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.page) === currentPage);
  });

  if (shouldScroll) {
    document.querySelector(".reader-stage").scrollIntoView({ block: "start" });
  }

  preloadPage(currentPage + 1);
  preloadPage(currentPage - 1);
}

function renderChapterMeta() {
  brandTitle.textContent = "Valtor";
  brandSubtitle.textContent = chapterName(currentChapter);
  chapterWorld.textContent = currentChapter.world;
  chapterTitle.textContent = chapterName(currentChapter);
  chapterDescription.textContent = currentChapter.description;
  chapterPages.textContent = String(currentChapter.pages);
  chapterFormat.textContent = currentChapter.format;
  chapterTone.textContent = currentChapter.tone;
  pageRange.max = String(currentChapter.pages);
}

function openDrawer() {
  if (thumbnailsBuiltFor !== currentChapter.id) {
    buildThumbnails();
  }

  indexDrawer.classList.add("open");
  indexDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  indexDrawer.classList.remove("open");
  indexDrawer.setAttribute("aria-hidden", "true");
}

function buildChapterList() {
  chapterList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  chapters.forEach((chapter) => {
    const button = document.createElement("button");
    button.className = "chapter-card";
    button.type = "button";
    button.dataset.chapter = chapter.id;
    button.setAttribute("aria-label", `Abrir ${chapterName(chapter)}`);

    const cover = document.createElement("img");
    cover.src = pageSrc(chapter, 1);
    cover.alt = `Capa de ${chapterName(chapter)}`;
    cover.loading = "lazy";

    const copy = document.createElement("span");
    copy.className = "chapter-card-copy";

    const eyebrow = document.createElement("small");
    eyebrow.textContent = `${chapter.number} · ${chapter.pages} páginas`;

    const title = document.createElement("strong");
    title.textContent = chapter.title;

    const world = document.createElement("span");
    world.textContent = chapter.world;

    copy.append(eyebrow, title, world);
    button.append(cover, copy);
    button.addEventListener("click", () => setChapter(chapter.id, true));
    fragment.appendChild(button);
  });

  chapterList.appendChild(fragment);
}

function buildThumbnails() {
  thumbGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (let page = 1; page <= currentChapter.pages; page += 1) {
    const button = document.createElement("button");
    button.className = "thumb-button";
    button.type = "button";
    button.dataset.page = String(page);
    button.setAttribute("aria-label", `Abrir página ${page}`);

    const thumb = document.createElement("img");
    thumb.src = pageSrc(currentChapter, page);
    thumb.alt = `Miniatura da página ${page}`;
    thumb.loading = page <= 4 ? "eager" : "lazy";

    const label = document.createElement("span");
    label.textContent = `Página ${page}`;

    button.append(thumb, label);
    button.addEventListener("click", () => {
      setPage(page, true);
      closeDrawer();
    });

    fragment.appendChild(button);
  }

  thumbGrid.appendChild(fragment);
  thumbnailsBuiltFor = currentChapter.id;
}

function buildScrollReader() {
  scrollReader.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (let page = 1; page <= currentChapter.pages; page += 1) {
    const figure = document.createElement("figure");
    figure.className = "scroll-page";
    figure.id = `pagina-${page}`;

    const pageImage = document.createElement("img");
    pageImage.src = pageSrc(currentChapter, page);
    pageImage.alt = `Página ${page} de ${chapterName(currentChapter)}`;
    pageImage.loading = page <= 2 ? "eager" : "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = `Página ${page} de ${currentChapter.pages}`;

    figure.append(pageImage, caption);
    fragment.appendChild(figure);
  }

  scrollReader.appendChild(fragment);
  scrollReaderBuiltFor = currentChapter.id;
}

function preloadPage(page) {
  if (page < 1 || page > currentChapter.pages) {
    return;
  }

  const preloadImage = new Image();
  const src = pageSrc(currentChapter, page);

  if (preloadedPages.has(src)) {
    return;
  }

  preloadedPages.add(src);
  preloadImage.decoding = "async";
  preloadImage.src = src;
}

function updateActiveChapter() {
  document.querySelectorAll(".chapter-card").forEach((button) => {
    button.classList.toggle("active", button.dataset.chapter === currentChapter.id);
  });
}

function setChapter(chapterId, shouldScroll = false) {
  const nextChapter = chapters.find((chapter) => chapter.id === chapterId);

  if (!nextChapter) {
    return;
  }

  currentChapter = nextChapter;
  currentPage = 1;
  thumbnailsBuiltFor = "";
  scrollReaderBuiltFor = "";
  preloadedPages.clear();
  thumbGrid.innerHTML = "";
  scrollReader.innerHTML = "";
  renderChapterMeta();
  updateActiveChapter();
  setPage(1, shouldScroll);
}

function toggleReadingMode() {
  const scrollMode = document.body.classList.toggle("scroll-mode");

  if (scrollMode && scrollReaderBuiltFor !== currentChapter.id) {
    buildScrollReader();
  }

  modeLabel.textContent = scrollMode ? "Modo rolagem" : "Modo página única";
  toggleMode.setAttribute(
    "aria-label",
    scrollMode ? "Alternar para página única" : "Alternar para rolagem"
  );

  if (scrollMode) {
    document.querySelector(`#pagina-${currentPage}`)?.scrollIntoView({ block: "start" });
  }
}

function updatePageFromScroll() {
  if (!document.body.classList.contains("scroll-mode")) {
    return;
  }

  const pages = [...document.querySelectorAll(".scroll-page")];
  const marker = window.innerHeight * 0.34;
  const visible = pages.find((page) => page.getBoundingClientRect().bottom > marker);

  if (visible) {
    const nextPage = Number(visible.id.replace("pagina-", ""));

    if (nextPage !== currentPage) {
      setPage(nextPage);
    }
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
    return;
  }

  document.exitFullscreen?.();
}

buildChapterList();
setChapter(currentChapter.id);

prevPage.addEventListener("click", () => setPage(currentPage - 1));
nextPage.addEventListener("click", () => setPage(currentPage + 1));
firstPage.addEventListener("click", () => setPage(1, true));
lastPage.addEventListener("click", () => setPage(currentChapter.pages, true));
pageRange.addEventListener("input", (event) => setPage(Number(event.target.value)));
toggleIndex.addEventListener("click", openDrawer);
closeIndex.addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
toggleMode.addEventListener("click", toggleReadingMode);
fullscreenButton.addEventListener("click", toggleFullscreen);
window.addEventListener("scroll", updatePageFromScroll, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }

  if (event.target instanceof HTMLInputElement) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    setPage(currentPage - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    setPage(currentPage + 1);
  }
});
