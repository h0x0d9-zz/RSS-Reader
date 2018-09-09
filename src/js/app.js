import { watch } from 'melanke-watchjs';

import {
  getFeedUrlInputElement,
  getNewFeedForm,
  renderNewFeed,
  renderNewArticle,
  renderWaiting,
  renderClean,
  renderNotValidInput,
  renderDuplicateErrorInput,
  renderLinkIsValid,
  renderSubmitError,
} from './render';

import {
  state,
  stateConstants,
  changeInput,
  addFeed,
  getArticles,
} from './state';

const onModelFormStateChanged = (_prop, _action, newState) => {
  switch (newState) {
    case stateConstants.linkNotValid:
      renderNotValidInput();
      break;
    case stateConstants.duplicateError:
      renderDuplicateErrorInput();
      break;
    case stateConstants.waiting:
      renderWaiting();
      break;
    case stateConstants.linkIsValid:
      renderLinkIsValid();
      break;
    case stateConstants.clean:
      renderClean();
      break;
    case stateConstants.error:
      renderSubmitError(state.error);
      break;
    default:
      throw new Error(`Transition to an unexpected state: ${newState}`);
  }
};

const onModelArticlesUpdated = () => {
  const articles = getArticles();
  articles.forEach(article => renderNewArticle(article));
};

const onModelFeedAdded = (_prop, _action, newFeed) => {
  renderNewFeed(newFeed);
};

const setupWatchers = () => {
  watch(state, 'formState', onModelFormStateChanged);
  watch(state, 'feedsList', onModelFeedAdded);
  watch(state, 'articlesList', onModelArticlesUpdated);
};

const feedUrlInputHandler = ({ target }) => changeInput(target.value);

const feedUrlSubmitHandler = (ev) => {
  ev.preventDefault();
  addFeed(state.newFeedUrl);
};

const setupHandlers = () => {
  getFeedUrlInputElement().addEventListener('input', feedUrlInputHandler);
  getNewFeedForm().addEventListener('submit', feedUrlSubmitHandler);
};

export default () => {
  setupWatchers();
  setupHandlers();
};
