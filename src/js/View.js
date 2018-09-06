import { watch } from 'melanke-watchjs';

export default class View {
  constructor(model) {
    this.model = model;
    watch(this.model.state, 'formState', this.onModelFormStateChanged.bind(this));
    watch(this.model.state, 'feedsList', this.onModelFeedAdded.bind(this));
    watch(this.model.state, 'articlesList', this.onModelArticlesUpdated.bind(this));

    this.inputElement = document.getElementById('linkInput');
    this.addFeedButton = document.getElementById('addFeedButton');
    this.feedsListMount = document.getElementById('feeds-list');
    this.articlesListMount = document.getElementById('articles');
    this.addfeedForm = document.getElementById('addFeedForm');

    this.changeInputHandler = null;
    this.addFeedHandler = null;
  }

  render() {
    this.inputElement.addEventListener('input', this.changeInputHandler);
    this.addfeedForm.addEventListener('submit', this.addFeedHandler);
  }

  renderInvalidFeedbackElement(feedBackStr) {
    const feedbackEl = this.renderFeedbackElement(feedBackStr);
    feedbackEl.classList.add('invalid-feedback');
  }

  renderFeedbackElement(feedBackStr) {
    const feedbackEl = document.createElement('DIV');
    feedbackEl.textContent = feedBackStr;
    this.inputElement.after(feedbackEl);
    return feedbackEl;
  }

  renderValidity(isValid, feedBackStr) {
    this.inputElement.classList[isValid ? 'remove' : 'add']('is-invalid');
    const oldFeedbackElement = this.inputElement.nextElementSibling;
    if (oldFeedbackElement) oldFeedbackElement.remove();

    if (!isValid) {
      this.renderInvalidFeedbackElement(feedBackStr);
    }
  }

  onModelFormStateChanged(_prop, _action, newState) {
    this.addFeedButton.removeAttribute('disabled');
    this.inputElement.removeAttribute('disabled');

    switch (newState) {
      case 'notValid':
        this.renderValidity(false, '');
        break;
      case 'duplicate':
        this.renderValidity(false, 'You are already subscribed to this feed.');
        break;
      case 'wait':
        this.renderFeedbackElement('Loading feed..');
        this.addFeedButton.setAttribute('disabled', true);
        this.inputElement.setAttribute('disabled', true);
        break;
      case 'isValid':
        this.renderValidity(true, '');
        break;
      case 'clean':
        this.renderValidity(true, '');
        this.inputElement.value = '';
        break;
      case 'error':
        this.renderInvalidFeedbackElement('Error getting data. Try once more');
        break;
      default:
        throw new Error(`Transition to an unexpected state: ${newState}`);
    }
  }

  renderFeed({ title, description }) {
    const titleEl = document.createElement('H5');
    titleEl.textContent = title;
    const desriptionEl = document.createElement('P');
    desriptionEl.textContent = description;

    const feedEl = document.createElement('DIV');
    feedEl.append(titleEl);
    feedEl.append(desriptionEl);

    this.feedsListMount.append(feedEl);
  }

  onModelArticlesUpdated() {
    const articles = this.model.getArticles();
    articles.forEach((article) => {
      const titleEl = document.createElement('A');
      titleEl.setAttribute('href', article.link);
      titleEl.textContent = article.title;

      const articleEl = document.createElement('P');
      articleEl.append(titleEl);

      this.articlesListMount.appendChild(articleEl);
    });
  }

  onModelFeedAdded(_prop, _action, newFeed) {
    this.renderFeed(newFeed);
  }
}
