/* @flow */

class I18n {
  _translations = {};
  _language: string = 'en';
  _language_direction: string = 'left_to_right';

  _supported_languages: Array<string> = ['en', 'ar'];
  _supported_language_directions: [string, string] =
    ['left_to_right', 'right_to_left'];

  constructor() {
    this._translations = {

    };
  }

  addTranslations(word: Object) {
    if (!word) {
      return;
    }

    if ('en' in word) {
      var prev = {};
      if (word.en in this._translations) {
        prev = this._translations[word.en];
      }

      this._translations[word.en] = {...prev, ...word};
    }
  }

  t(word: string) {
    if (word in this._translations) {
      if (this._language in this._translations[word]) {
        return tihs._translations[word][this._language];
      }
    }
    return word;
  }
}

module.exports = new I18n;
