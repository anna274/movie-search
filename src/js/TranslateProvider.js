import { Provider } from './Provider';

export class TranslateProvider extends Provider {
  constructor(key) {
    super();
    this.key = key;
  }

  async translate(word) {
    if (/[^\w\s]/.test(word)) {
      const responseObject = await TranslateProvider.getDate(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.key}&text=${word}&lang=ru-en`);
      return responseObject.text[0];
    }
    return word;
  }
}
