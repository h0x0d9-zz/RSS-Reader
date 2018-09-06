import Model from './Model';
import View from './View';
import Controller from './Controller';

export default () => {
  const model = new Model();
  const view = new View(model);
  const controller = new Controller(model, view);
  controller.init();
};
