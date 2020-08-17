import { Provider } from './Provider';

const IMBD_URL = 'https://www.omdbapi.com';
const moviesPerPage = 10;

export class MovieProvider extends Provider {
  constructor(key) {
    super();
    this.url = IMBD_URL;
    this.key = key;
    this.lastWord = '';
    this.page = 1;
    this.allLoaded = false;
  }

  async getFirstPage(searchWord) {
    const commonDate = await MovieProvider.getDate(`${this.url}/?s=${searchWord}&type=movie&apikey=${this.key}`);
    if (commonDate.Response === 'False') {
      throw new Error(`No results for ${searchWord}`);
    }
    this.page = 1;
    this.lastWord = searchWord;
    return commonDate;
  }

  async getNextPage() {
    this.page += 1;
    const commonDate = await MovieProvider.getDate(`${this.url}/?s=${this.lastWord}&type=movie&page=${this.page}&apikey=${this.key}`);
    return commonDate;
  }

  async getMoviesDate(searchWord) {
    let commonDate;
    if (!searchWord && searchWord !== this.lastWord) {
      commonDate = await this.getNextPage();
    } else {
      commonDate = await this.getFirstPage(searchWord);
    }
    this.allLoaded = this.page === Math.ceil(commonDate.totalResults / moviesPerPage);
    const fullDate = [];
    const imbdIDs = commonDate.Search.map((el) => el.imdbID);
    const requests = imbdIDs.map((id) => MovieProvider.getDate(`${this.url}/?i=${id}&apikey=${this.key}`));
    await Promise.all(requests)
      .then((movies) => movies.forEach((movie) => fullDate.push(movie)));
    return fullDate;
  }
}
