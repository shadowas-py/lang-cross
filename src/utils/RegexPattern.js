export default class WordFinder {
  constructor(charList) {
    this.stringSequence = charList.join('');
  }

  get() {
    return new RegExp(`$${this.stringSequence}^`);
  }

  set(charList) {
    this.stringSequence = charList.join('');
  }
}
