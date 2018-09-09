import isUrl from 'validator/lib/isURL';

import fetchFeed from './loader';

export const stateConstants = Object.freeze({
  clean: 'clean',
  linkIsValid: 'isValid',
  linkNotValid: 'notValid',
  duplicateError: 'duplicate',
  waiting: 'waiting',
  error: 'error',
});

export const state = {
  formState: stateConstants.clean,
  newFeedUrl: '',
  feedsList: [],
  articlesList: [],
  error: null,
};

const isLinkExist = (feedUrl) => {
  const existsLinks = new Set(state.feedsList.map(({ link }) => link));
  return existsLinks.has(feedUrl);
};

export const changeInput = (inputValue) => {
  state.newFeedUrl = inputValue;

  if (!inputValue) {
    state.formState = stateConstants.clean;
    return;
  }

  if (isUrl(inputValue)) {
    state.formState = isLinkExist(inputValue)
      ? stateConstants.duplicateError : stateConstants.linkIsValid;
  } else {
    state.formState = stateConstants.linkNotValid;
  }
};

export const addArticles = (newArticles) => {
  const storedLinks = new Set(...[state.articlesList.map(({ link }) => link)]);
  const adding = newArticles.filter(({ link }) => !storedLinks.has(link));
  state.articlesList.push(...adding);
};

export const addFeed = (feedUrl) => {
  if (state.formState !== stateConstants.linkIsValid) {
    return;
  }

  state.formState = stateConstants.waiting;
  fetchFeed(feedUrl)
    .then(feed => ({ ...feed, link: feedUrl }))
    .then((feed) => {
      state.feedsList.push(feed);
      state.formState = stateConstants.clean;
      state.newFeedUrl = '';

      addArticles(feed.articles);
    })
    .catch((error) => {
      state.formState = stateConstants.error;
      state.error = new Error(error);
    });
};

export const getArticles = () => state.articlesList
  .slice()
  .sort((a, b) => a.pubDate - b.pubDate);
