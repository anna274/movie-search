import Swiper from '../node_modules/swiper/js/swiper';
import { Slide } from './js/Slide';
import { MovieProvider } from './js/MovieProvider';
import { TranslateProvider } from './js/TranslateProvider';
import { Keyboard } from './js/Keyboard';
import { keyboardLayouts } from './js/keyboardLayouts';

const IMDB_API_KEY = 'bf038eea';
const TRANSATER_API_KEY = 'trnsl.1.1.20200504T071608Z.39d69b4ca5a654f2.3b2b271ff02a76d634bf1c759a10219388ac869b';
const provider = new MovieProvider(IMDB_API_KEY);
const translateProvider = new TranslateProvider(TRANSATER_API_KEY);
const mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  slidesPerView: 1,
  spaceBetween: 30,
  centerInsufficientSlides: true,

  breakpoints: {
    1101: {
      slidesPerView: 4,
    },
    871: {
      slidesPerView: 3,
    },
    661: {
      slidesPerView: 2,
    },
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
const RESULT_FIELD = document.querySelector('.result-field');
const keyboard = new Keyboard(keyboardLayouts, document.querySelector('#search_input'));


function generateLoader() {
  return '<div class="loader">Loading...</div>';
}

async function renderSlides(searchWord) {
  const movies = await provider.getMoviesDate(searchWord);
  const slides = [];
  movies.forEach((movie) => {
    // eslint-disable-next-line max-len
    const slide = new Slide(movie.Title, movie.Poster, movie.Year, movie.imdbRating, movie.imdbID, movie.Country, movie.Genre, movie.Runtime);
    slides.push(slide.renderSlide());
  });
  return slides;
}

async function addSlides(searchWord) {
  try {
    const resultFieldValue = RESULT_FIELD.innerHTML;
    RESULT_FIELD.innerHTML = generateLoader();
    const slides = await renderSlides(searchWord);
    mySwiper.appendSlide(slides);
    mySwiper.update();
    RESULT_FIELD.innerHTML = resultFieldValue;
  } catch (error) {
    RESULT_FIELD.innerHTML = error;
  }
}

function changeSlides(newSlides) {
  mySwiper.wrapperEl.classList.add('disappear');
  mySwiper.wrapperEl.addEventListener('animationend', () => {
    mySwiper.wrapperEl.classList.remove('disappear');
    mySwiper.slideTo(0);
    mySwiper.removeAllSlides();
    mySwiper.appendSlide(newSlides);
    mySwiper.update();
    mySwiper.wrapperEl.classList.add('appear');
    mySwiper.wrapperEl.addEventListener('animationend', () => {
      mySwiper.wrapperEl.classList.remove('appear');
    });
  });
}

async function search(searchWord) {
  try {
    RESULT_FIELD.innerHTML = generateLoader();
    const translation = await translateProvider.translate(searchWord);
    const slides = await renderSlides(translation);
    RESULT_FIELD.innerHTML = `Showing results for <strong>"${translation}"</strong>`;
    changeSlides(slides);
  } catch (error) {
    RESULT_FIELD.innerHTML = error.message;
  }
}

mySwiper.on('reachEnd', () => {
  if (mySwiper.slides.length !== 0 && !provider.allLoaded) {
    addSlides();
  }
});

function submitSearch(event) {
  if (event) {
    event.preventDefault();
  }
  const searchWord = document.getElementById('search_input').value;
  if (searchWord !== '') {
    search(searchWord);
  }
}

document.querySelector('#search_form').addEventListener('submit', (event) => {
  submitSearch(event);
});

keyboard.main.addEventListener('mouseup', (event) => {
  if (event.target.classList.contains('Enter')) {
    keyboard.main.classList.remove('active');
    submitSearch();
  }
});

document.querySelector('#clear_button').addEventListener('click', () => {
  document.querySelector('#search_input').value = '';
});

document.querySelector('#keyboard_icon').addEventListener('click', () => {
  document.querySelector('.keyboard').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
  addSlides('dream');
});
