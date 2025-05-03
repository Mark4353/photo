const API_KEY = "49809824-6020f8c5e3e6ee0bf43d51bd8";
const Pix_URL = "https://pixabay.com/api/";
let page = 1;
let currentQuery = "";

const form = document.getElementById("search-form");
const gallery = document.getElementById("gallery");
const loadMoreBtn = document.getElementById("load-more");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = e.target.query.value.trim();
  if (!query) return;
  currentQuery = query;
  page = 1;
  gallery.innerHTML = "";
  await fetchImages();
});

loadMoreBtn.addEventListener("click", fetchImages);

async function fetchImages() {
  const url = `${Pix_URL}?image_type=photo&orientation=horizontal&q=${encodeURIComponent(
    currentQuery
  )}&page=${page}&per_page=12&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits.length === 0) {
      loadMoreBtn.style.display = "none";
      return;
    }

    renderImages(data.hits);
    page += 1;
    loadMoreBtn.style.display = "block";

    const lastCard = gallery.lastElementChild;
    if (lastCard) lastCard.scrollIntoView({ behavior: "smooth", block: "end" });
  } catch (error) {
    console.error("Помилка", error);
  }
}

function renderImages(images) {
  const markup = images
    .map(
      (img) => `
    <li>
      <div class="photo-card">
        <img src="${img.webformatURL}" alt="${img.tags}" />
        <div class="stats">
          <p class="stats-item">${img.likes}</p>
          <p class="stats-item">${img.views}</p>
          <p class="stats-item">${img.comments}</p>
          <p class="stats-item">${img.downloads}</p>
        </div>
      </div>
    </li>
  `
    )
    .join("");

  gallery.insertAdjacentHTML("beforeend", markup);
}
