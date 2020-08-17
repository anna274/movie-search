export class Provider {
  static getDate(url) {
    return fetch(url)
      .then((response) => response.json());
  }
}
