import Notiflix from 'notiflix';
import { fetchArticles } from './js/pixabay';
import { createCards } from './js/photo-card';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const searchText = document.querySelector('.input');
const searchButton = document.querySelector('.btn-search');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.btn-more');

const title = document.querySelector('.counter');

let query = '';
let totalHits = 0;
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();
  page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  clearFormGallery();
  loadMoreButton.classList.add('is-hidden');
  if (query === '') {
    noInfoForSearch();
    return;
  }

  fetchArticles(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoContentFound();
      } else {
        createCards(data.hits);
        const lightbox = new SimpleLightbox('.gallery a', {
          captionDelay: 250,
        }).refresh();
        addTotalInfoCounter(data);

        if (data.totalHits > perPage) {
          loadMoreButton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  page += 1;
  fetchArticles(query, page, perPage)
    .then(({ data }) => {
      createCards(data.hits);
      const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
      }).refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page === totalPages) {
        loadMoreButton.classList.add('is-hidden');
        endOfContent();
      }
    })
    .catch(error => console.log(error));
}

function clearFormGallery() {
  gallery.innerHTML = '';
}



function addTotalInfoCounter(data) {
  Notiflix.Notify.success(`Вітаємо! Ми знайшли ${data.totalHits} зображень.`);
}

function noInfoForSearch() {
  Notiflix.Notify.failure('Будь ласка, уточніть Ваш пошуковий запит.');
}

function endOfContent() {
  Notiflix.Notify.warning(
    "Вибачте, ви досягли кінця результатів пошуку."
  );
}

function alertNoContentFound() {
  Notiflix.Notify.failure(
    'Вибачте, зображень за Вашим запитом немає. Будь ласка, спробуйте ще раз.'
  );
}
