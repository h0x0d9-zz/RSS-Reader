export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.addFeedHandler = this.addFeed.bind(this);
    this.view.changeInputHandler = this.changeInput.bind(this);

    this.view.render();
  }

  changeInput({ target }) {
    this.model.changeInput(target.value);
  }

  addFeed(e) {
    e.preventDefault();
    this.model.addFeed(this.model.getCurrentInput());
  }
}
