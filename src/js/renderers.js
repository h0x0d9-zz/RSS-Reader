import $ from 'jquery';

export const getFeedUrlInputElement = () => document.getElementById('linkInput');
export const getFeedUrlSubmitButton = () => document.getElementById('addFeedButton');
export const getArticlesListMountElement = () => document.getElementById('articles');
export const getNewFeedForm = () => document.getElementById('addFeedForm');
const getFeedListMountElement = () => document.getElementById('feeds-list');

const removeFeedbackElement = () => {
  const oldFeedbackElement = getFeedUrlInputElement().nextElementSibling;
  if (oldFeedbackElement) {
    oldFeedbackElement.remove();
  }
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

export const renderNewArticle = ({ title, link, description }) => {
  $(getArticlesListMountElement())
    .append(
      $('<div class="row mt-3">').append(
        $('<div class="col-lg-8">')
          .append(
            $('<a>').attr('href', link)
              .append(
                $('<span>').append(title),
              ),
          ),
        $('<div class="col-lg-4">')
          .append(
            $('<button>').attr({
              type: 'button',
              class: 'btn btn-primary btn-sm',
              'data-toggle': 'modal',
              'data-target': '#articleDescriptionModal',
            }).on('click', (ev) => {
              ev.preventDefault();
              $('#articleDescriptionModal .modal-body').text(description);
            })
              .append('Description'),
          ),
      ),
    );
};

export const renderNewFeed = ({ title, description }) => {
  $(getFeedListMountElement())
    .append('<div>').append(
      $('<h5>').append(title),
      $('<p>').append(description),
    );
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

export const renderError = (error) => {
  if (error === null) {
    renderValidity(true, '');
  } else {
    renderValidity(false, error.toString());
  }

  getFeedUrlSubmitButton().removeAttribute('disabled');
  getFeedUrlInputElement().removeAttribute('disabled');
};
