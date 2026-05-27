const totalPages = 20;
let currentPage = 1;

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

function pageSrc(page) {
  return `Ilustrações/${page}.png`;
}

function clampPage(page) {
  return Math.min(totalPages, Math.max(1, page));
}

function setPage(page, shouldScroll = false) {
  currentPage = clampPage(page);
  image.src = pageSrc(currentPage);
  image.alt = `Pagina ${currentPage} da HQ A Criança Carmesin`;
  pageLabel.textContent = `Página ${currentPage} de ${totalPages}`;
  pageRange.value = String(currentPage);
  progressBar.style.width = `${(currentPage / totalPages) * 100}%`;
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;

  document.querySelectorAll(".thumb-button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.page) === currentPage);
  });

  if (shouldScroll) {
    document.querySelector(".reader-stage").scrollIntoView({ block: "start" });
  }
}

function openDrawer() {
  indexDrawer.classList.add("open");
  indexDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  indexDrawer.classList.remove("open");
  indexDrawer.setAttribute("aria-hidden", "true");
}

function buildThumbnails() {
  const fragment = document.createDocumentFragment();

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");
    button.className = "thumb-button";
    button.type = "button";
    button.dataset.page = String(page);
    button.setAttribute("aria-label", `Abrir pagina ${page}`);

    const thumb = document.createElement("img");
    thumb.src = pageSrc(page);
    thumb.alt = `Miniatura da pagina ${page}`;
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
}

function buildScrollReader() {
  const fragment = document.createDocumentFragment();

  for (let page = 1; page <= totalPages; page += 1) {
    const figure = document.createElement("figure");
    figure.className = "scroll-page";
    figure.id = `pagina-${page}`;

    const pageImage = document.createElement("img");
    pageImage.src = pageSrc(page);
    pageImage.alt = `Pagina ${page} da HQ A Criança Carmesin`;
    pageImage.loading = page <= 2 ? "eager" : "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = `Página ${page} de ${totalPages}`;

    figure.append(pageImage, caption);
    fragment.appendChild(figure);
  }

  scrollReader.appendChild(fragment);
}

function toggleReadingMode() {
  const scrollMode = document.body.classList.toggle("scroll-mode");
  modeLabel.textContent = scrollMode ? "Modo rolagem" : "Modo página única";
  toggleMode.setAttribute(
    "aria-label",
    scrollMode ? "Alternar para pagina unica" : "Alternar para rolagem"
  );

  if (scrollMode) {
    document.querySelector(`#pagina-${currentPage}`).scrollIntoView({ block: "start" });
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
    setPage(Number(visible.id.replace("pagina-", "")));
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
    return;
  }

  document.exitFullscreen?.();
}

buildThumbnails();
buildScrollReader();
setPage(1);

prevPage.addEventListener("click", () => setPage(currentPage - 1));
nextPage.addEventListener("click", () => setPage(currentPage + 1));
firstPage.addEventListener("click", () => setPage(1, true));
lastPage.addEventListener("click", () => setPage(totalPages, true));
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

  if (event.key === "ArrowLeft") {
    setPage(currentPage - 1);
  }

  if (event.key === "ArrowRight") {
    setPage(currentPage + 1);
  }
});
