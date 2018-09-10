import isUrl from 'validator/lib/isURL';

export const stateConstants = Object.freeze({
  clean: 'clean',
  linkIsValid: 'isValid',
  linkNotValid: 'notValid',
  duplicateError: 'duplicate',
  waiting: 'waiting',
});

const isLinkExist = (feedUrl, state) => {
  const existsLinks = new Set(state.feedsList.map(({ link }) => link));
  return existsLinks.has(feedUrl);
};

export const updateInputState = (inputValue, oldState) => {
  const newState = { newFeedUrl: inputValue };

  if (!inputValue) {
    newState.formState = stateConstants.clean;
    return newState;
  }

  if (isUrl(inputValue)) {
    newState.formState = isLinkExist(inputValue, oldState)
      ? stateConstants.duplicateError : stateConstants.linkIsValid;
  } else {
    newState.formState = stateConstants.linkNotValid;
  }

  return newState;
};
