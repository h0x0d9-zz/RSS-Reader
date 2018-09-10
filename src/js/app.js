import { watch } from 'melanke-watchjs';

import fetchFeed from './loader';

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
  renderError,
} from './renderers';

import {
  stateConstants,
  updateInputState,
} from './stateUtils';


const timerDelay = 5000;

export default () => {
  const state = {
    formState: stateConstants.clean,
    newFeedUrl: '',
    feedsList: [],
    articlesList: [],
    currentError: null,
  };

  const onFormStateChanged = (_prop, _action, newState) => {
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
      default:
        throw new Error(`Transition to an unexpected state: ${newState}`);
    }
  };

  const onStateArticlesUpdated = (_prop, _action, val) => {
    const startIndex = state.articlesList.indexOf(val);
    const articles = state.articlesList.slice(startIndex);
    articles.forEach(article => renderNewArticle(article));
  };

  const onStateFeedAdded = (_prop, _action, newFeed) => {
    renderNewFeed(newFeed);
  };

  const onModelCaughtError = (_prop, _action, err) => {
    renderError(err);
  };

  const setupWatchers = () => {
    watch(state, 'formState', onFormStateChanged);
    watch(state, 'feedsList', onStateFeedAdded);
    watch(state, 'articlesList', onStateArticlesUpdated);
    watch(state, 'currentError', onModelCaughtError);
  };

  const inputHandler = ({ target }) => Object.assign(
    state, updateInputState(target.value, state),
  );

  const addArticles = (articles) => {
    const storedLinks = state.articlesList.map(({ link }) => link);
    const adding = articles.filter(({ link }) => !storedLinks.includes(link));

    if (adding.length !== 0) {
      state.articlesList.push(...adding);
    }
  };

  const submitHandler = (ev) => {
    ev.preventDefault();
    if (state.formState !== stateConstants.linkIsValid) {
      return;
    }

    state.formState = stateConstants.waiting;

    fetchFeed(state.newFeedUrl)
      .then(feed => ({ ...feed, link: state.newFeedUrl }))
      .then((feed) => {
        state.formState = stateConstants.clean;
        state.newFeed = '';
        state.feedsList.push(feed);
        addArticles(feed.articles);
      })
      .catch((error) => {
        state.currentError = new Error(error);
      });
  };

  const setupHandlers = () => {
    getFeedUrlInputElement().addEventListener('input', inputHandler);
    getNewFeedForm().addEventListener('submit', submitHandler);
  };

  const runUpdate = () => {
    const feedsLinks = state.feedsList.map(({ link }) => link);
    if (feedsLinks.length === 0) {
      setTimeout(runUpdate, timerDelay);
      return;
    }

    Promise.all(feedsLinks.map(fetchFeed))
      .then(feeds => feeds.forEach(feed => addArticles(feed.articles)))
      .catch((err) => {
        console.warn(err);
      })
      .finally(() => setTimeout(runUpdate, timerDelay));
  };

  const init = () => {
    setupWatchers();
    setupHandlers();
    runUpdate();
  };

  init();
};
