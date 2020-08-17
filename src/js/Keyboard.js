const eventKeysLayout = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['Langs', 'Space', 'ArrowLeft', 'ArrowRight', 'Langs'],
];
export class Keyboard {
  constructor(layouts, textarea) {
    this.main = null;
    this.rows = [];
    this.keys = [];
    this.caps = false;
    this.langs = [];
    this.currentLang = 0;
    this.shift = false;
    this.textarea = textarea;
    this.init(layouts);
  }

  init(layouts) {
    this.main = this.createBaseLangLayout(layouts[0]);
    this.rows = this.main.querySelectorAll('.keyboard__row');
    this.keys = this.main.querySelectorAll('.key');
    this.addLeftLangs(layouts.slice(1, layouts.length));
    this.switchLang(localStorage.getItem('lang'));
    this.switchCase();
    this.main.innerHTML += '<span class="keyboard__close">&times;</span>';
    document.querySelector('main').append(this.main);
    this.addEvents();
  }

  addEvents() {
    this.main.addEventListener('mousedown', (event) => {
      if (event.target.closest('.key')) {
        this.handleMousedown(event.target.closest('.key'));
      }
    });
    document.querySelector('.keyboard__close').addEventListener('click', () => {
      this.main.classList.remove('active');
    });
  }

  createBaseLangLayout(baseLayout) {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    this.langs.push(baseLayout.lang);
    baseLayout.keysLayout.forEach((row, i) => {
      keyboard.append(this.createRow(row, eventKeysLayout[i]));
    });
    return keyboard;
  }

  addLeftLangs(layouts) {
    layouts.forEach((layout) => {
      this.addLang(layout);
    });
  }

  addLang(langLayout) {
    this.langs.push(langLayout.lang);
    this.currentLang += 1;
    langLayout.keysLayout.forEach((row, i) => {
      const keyboardKeys = this.rows[i].querySelectorAll('.key');
      row.forEach((key, j) => {
        if (!(key.length === 1 && key[0].length !== 1)) {
          if (key.length === 1 && key[0].length === 1) {
            this.addOutputtedKeyInner(keyboardKeys[j], 'letter', key[0].toLowerCase(), key[0].toUpperCase());
          } else {
            this.addOutputtedKeyInner(keyboardKeys[j], 'sign', key[0], key[1]);
          }
        }
      });
    });
  }

  createRow(row, eventKeyRow) {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard__row');
    row.forEach((key, i) => {
      keyboardRow.append(this.createKey(key, eventKeyRow[i]));
    });
    return keyboardRow;
  }

  // eslint-disable-next-line class-methods-use-this
  createKey(key, eventKey) {
    const keyElement = document.createElement('div');
    keyElement.classList.add('key', eventKey);
    if (key.length === 1 && key[0].length === 1) {
      this.addOutputtedKeyInner(keyElement, 'letter', key[0].toLowerCase(), key[0].toUpperCase());
    } else if (key.length === 2) {
      this.addOutputtedKeyInner(keyElement, 'sign', key[0], key[1]);
    } else {
      this.addFunctionKeyInner(keyElement, key[0]);
    }
    return keyElement;
  }


  addOutputtedKeyInner(keyElement, type, normal, shift) {
    const lang = document.createElement('div');
    lang.classList.add(this.langs[this.currentLang]);
    lang.setAttribute('key-type', type);
    lang.append(this.addState(['normal', 'open'], normal), this.addState(['shift'], shift));
    keyElement.append(lang);
  }

  // eslint-disable-next-line class-methods-use-this
  addState(states, stateValue) {
    const state = document.createElement('div');
    state.classList.add(...states);
    state.textContent = stateValue;
    return state;
  }

  // eslint-disable-next-line class-methods-use-this
  addFunctionKeyInner(keyElement, value) {
    keyElement.setAttribute('key-type', 'function');
    switch (value) {
      case 'caps lock':
        keyElement.classList.add('key_2-wide', 'key_activatable');
        // eslint-disable-next-line no-param-reassign
        keyElement.textContent = value;
        break;
      case 'shift':
      case 'backspace':
      case 'enter':
      case 'ru - en':
        keyElement.classList.add('key_2-wide');
        // eslint-disable-next-line no-param-reassign
        keyElement.textContent = value;
        break;
      case 'space':
        keyElement.classList.add('key_4-wide');
        break;
      case 'left':
      case 'right': {
        const img = document.createElement('img');
        img.classList.add('key__icon');
        img.setAttribute('src', `./assets/img/${value}.png`);
        keyElement.append(img);
        break;
      }
      default:
        // eslint-disable-next-line no-param-reassign
        keyElement.textContent = value;
    }
  }

  switchLang(savedLang) {
    this.switchShift();
    document.querySelectorAll(`.${this.langs[this.currentLang]}`).forEach((el) => {
      el.classList.remove('open');
    });
    this.currentLang = savedLang || (this.currentLang + 1) % this.langs.length;
    this.main.querySelectorAll(`.${this.langs[this.currentLang]}`).forEach((el) => {
      el.classList.add('open');
    });
    this.switchShift();
    this.switchCase();
  }

  switchCase() {
    if ((this.caps && !this.shift) || (!this.caps && this.shift)) {
      this.main.querySelectorAll('.key .open[key-type="letter"]').forEach((key) => {
        key.querySelector('.normal').classList.remove('open');
        key.querySelector('.shift').classList.add('open');
      });
    } else {
      this.main.querySelectorAll('.key .open[key-type="letter"]').forEach((key) => {
        key.querySelector('.shift').classList.remove('open');
        key.querySelector('.normal').classList.add('open');
      });
    }
  }

  switchShift() {
    this.shift = !this.shift;
    const letters = this.main.querySelectorAll('.key > .open[key-type="letter"]');
    const signs = this.main.querySelectorAll('.key > .open[key-type="sign"]');
    letters.forEach((key) => {
      key.querySelector('.normal').classList.toggle('open');
      key.querySelector('.shift').classList.toggle('open');
    });
    if (this.shift) {
      signs.forEach((key) => {
        key.querySelector('.normal').classList.remove('open');
        key.querySelector('.shift').classList.add('open');
      });
    } else {
      signs.forEach((key) => {
        key.querySelector('.normal').classList.add('open');
        key.querySelector('.shift').classList.remove('open');
      });
    }
  }

  handleMousedown(key) {
    if (key.hasAttribute('key-type', 'function')) {
      this.handleFunction(key.classList[1]);
    } else {
      this.display(key.querySelector('.open .open').textContent);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  keyIsHandled(keyCode) {
    return eventKeysLayout.some((row) => row.some((layoutCode) => layoutCode === keyCode));
  }

  handleFunction(keyCode) {
    switch (keyCode) {
      case 'CapsLock':
        document.querySelector('.key_activatable').classList.toggle('on');
        this.caps = !this.caps;
        this.switchCase();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.switchShift();
        break;
      case 'Backspace':
        this.handleBackspace();
        break;
      case 'Delete':
        this.handleDelete();
        break;
      case 'Space':
        this.display(' ');
        break;
      case 'Langs':
        this.switchLang();
        break;
      case 'ArrowLeft':
        this.moveArrow(this.textarea.selectionStart - 1);
        break;
      case 'ArrowRight':
        this.moveArrow(this.textarea.selectionStart + 1);
        break;
      default:
    }
  }

  // eslint-disable-next-line class-methods-use-this

  handleBackspace() {
    if (this.textarea.selectionStart === this.textarea.selectionEnd) {
      if (this.textarea.selectionStart > 0) {
        this.textarea.setRangeText('', this.textarea.selectionEnd - 1, this.textarea.selectionEnd, 'end');
      }
    } else {
      this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
    }
  }

  handleDelete() {
    if (this.textarea.selectionStart === this.textarea.selectionEnd) {
      if (this.textarea.selectionStart <= this.textarea.value.length) {
        this.textarea.setRangeText('', this.textarea.selectionEnd, this.textarea.selectionEnd + 1, 'end');
      }
    } else {
      this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
    }
  }

  moveArrow(offset) {
    this.textarea.selectionEnd = offset;
    this.textarea.selectionStart = offset;
  }

  display(value, repetition = 1) {
    this.textarea.setRangeText(value.repeat(repetition), this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
  }
}
