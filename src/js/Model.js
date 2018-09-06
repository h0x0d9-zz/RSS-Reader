import isUrl from 'validator/lib/isURL';
import axios from 'axios';
import parse from './RssParser';

const proxyURL = 'https://cors-anywhere.herokuapp.com/';

export const formsStates = {
  clean: 'clean',
  linkIsValid: 'isValid',
  linkNotValid: 'notValid',
  duplicateError: 'duplicate',
  wait: 'wait',
  error: 'error',
};

export default class Model {
  constructor() {
    this.state = {
      formState: formsStates.clean,
      currentInput: '',
      feedsList: [],
      articlesList: [],
    };
  }

  changeInput(inputValue) {
    this.state.currentInput = inputValue;

    if (!inputValue) {
      this.state.formState = formsStates.clean;
      return;
    }

    if (isUrl(inputValue)) {
      this.state.formState = this.isLinkExist(inputValue)
        ? formsStates.duplicateError : formsStates.linkIsValid;
    } else {
      this.state.formState = formsStates.linkNotValid;
    }
  }

  isLinkExist(feedUrl) {
    const existsLinks = new Set(this.state.feedsList.map(({ link }) => link));
    return existsLinks.has(feedUrl);
  }

  fetchFeed = (feedUrl) => {
    const url = [proxyURL, feedUrl].join('');
    return axios.get(url)
      .then(response => response.data);
  }

  loadFeed = data => parse(data);

  addFeed(feedUrl) {
    if (this.state.formState !== formsStates.linkIsValid) {
      return;
    }

    this.state.formState = formsStates.wait;
    this.fetchFeed.call(this, feedUrl)
      .then(this.loadFeed.bind(this))
      .then((feed) => {
        this.state.feedsList.push({ ...feed, link: feedUrl });
        this.state.formState = formsStates.clean;
        this.state.currentInput = '';

        this.addArticles(feed.articles);
      })
      .catch(() => {
        this.state.formState = formsStates.error;
      });
  }

  addArticles(newArticles) {
    const storedLinks = new Set(...[this.state.articlesList.map(({ link }) => link)]);
    const adding = newArticles.filter(({ link }) => !storedLinks.has(link));
    this.state.articlesList.push(...adding);
  }

  getArticles() {
    return this.state.articlesList
      .slice()
      .sort((a, b) => a.pubDate - b.pubDate);
  }

  getCurrentInput() {
    return this.state.currentInput;
  }
}
