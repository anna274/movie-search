const URL_IMG_DEFAULT = './assets/img/No_Picture.jpg';
export class Slide {
  constructor(title, urlToImg, year, rate, id, country, genre, runtime) {
    this.title = title;
    this.urlToImg = (urlToImg !== 'N/A') ? urlToImg : URL_IMG_DEFAULT;
    this.year = year;
    this.rate = (rate !== 'N/A') ? rate : '-';
    this.id = id;
    this.country = country;
    this.genre = genre;
    this.runtime = runtime;
  }

  generateContent() {
    let content = '';
    let addInfo = '';
    content += '<div class="slide">';
    content += `<div class="slide__title"><a target="_blank" href="https://www.imdb.com/title/${this.id}/?ref_=nv_sr_srsg_0"><h4>${this.title}</h4></a></div>`;
    content += `<div class="slide__img-container"><img class="slide__img" src="${this.urlToImg}" onerror="this.src='${URL_IMG_DEFAULT}'"></div>`;
    content += `<div class="slide__year"><p>${this.year}</p></div>`;
    content += `<div class="slide__rate"><span class="icon icon-star"></span><p>${this.rate}</p></div>`;
    addInfo += '<div class="slide__add-info">';
    addInfo += `<div class="add-item"><p class="item">Country:</p><p class="description">${this.country}</p></div>`;
    addInfo += `<div class="add-item"><p class="item">Genre:</p><p class="description">${this.genre}</p></div>`;
    addInfo += `<div class="add-item"><p class="item">Runtime:</p><p class="description">${this.runtime}</p></div>`;
    addInfo += `<div class="add-item"><a target="_blank" href="https://www.imdb.com/title/${this.id}/?ref_=nv_sr_srsg_0">View more</a></div>`;
    addInfo += '</div>';
    content += addInfo;
    content += '</div>';

    return content;
  }

  renderSlide() {
    let wrapper = '<div class="swiper-slide">';
    wrapper += this.generateContent();
    wrapper += '</div>';
    return wrapper;
  }
}
