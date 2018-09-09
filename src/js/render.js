export const getFeedUrlInputElement = () => document.getElementById('linkInput');
export const getFeedUrlSubmitButton = () => document.getElementById('addFeedButton');
export const getArticlesListMountElement = () => document.getElementById('articles');
export const getNewFeedForm = () => document.getElementById('addFeedForm');
const getFeedListMountElement = () => document.getElementById('feeds-list');

const removeFeedbackElement = () => {
  const oldFeedbackElement = getFeedUrlInputElement().nextElementSibling;
  if (oldFeedbackElement) oldFeedbackElement.remove();
};

export const renderFeedbackElement = (feedBackStr) => {
  removeFeedbackElement();

  const feedbackEl = document.createElement('DIV');
  feedbackEl.textContent = feedBackStr;
  getFeedUrlInputElement().after(feedbackEl);
  return feedbackEl;
};

export const renderInvalidFeedbackElement = (feedBackStr) => {
  const feedbackEl = renderFeedbackElement(feedBackStr);
  feedbackEl.classList.add('invalid-feedback');
};

export const renderValidity = (isValid, feedBackStr) => {
  getFeedUrlInputElement().classList[isValid ? 'remove' : 'add']('is-invalid');

  removeFeedbackElement();
  if (!isValid) {
    renderInvalidFeedbackElement(feedBackStr);
  }
};

export const renderNewArticle = (article) => {
  const titleEl = document.createElement('A');
  titleEl.setAttribute('href', article.link);
  titleEl.textContent = article.title;
  const articleEl = document.createElement('P');
  articleEl.append(titleEl);
  getArticlesListMountElement().appendChild(articleEl);
};


export const renderNewFeed = ({ title, description }) => {
  const titleEl = document.createElement('H5');
  titleEl.textContent = title;
  const desriptionEl = document.createElement('P');
  desriptionEl.textContent = description;

  const feedEl = document.createElement('DIV');
  feedEl.append(titleEl);
  feedEl.append(desriptionEl);

  getFeedListMountElement().append(feedEl);
};

export const renderWaiting = () => {
  renderFeedbackElement('Loading feed..');
  getFeedUrlSubmitButton().setAttribute('disabled', true);
  getFeedUrlInputElement().setAttribute('disabled', true);
};

export const renderClean = () => {
  renderValidity(true, '');
  getFeedUrlSubmitButton().removeAttribute('disabled');
  getFeedUrlInputElement().removeAttribute('disabled');
  getFeedUrlInputElement().value = '';
};

export const renderNotValidInput = () => renderValidity(false, '');

export const renderDuplicateErrorInput = () => renderValidity(false, 'You are already subscribed to this feed.');

export const renderLinkIsValid = () => renderValidity(true, '');

export const renderSubmitError = (error) => {
  renderValidity(false, error.toString());
  getFeedUrlSubmitButton().removeAttribute('disabled');
  getFeedUrlInputElement().removeAttribute('disabled');
};
