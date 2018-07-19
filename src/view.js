import ko from 'knockout';
export default class View {
  constructor(root, template, model, ...args) {
    this.root = root;
    this.template = template;
    this.model = model;
    this.bootstrap(root, ...args);
  }
  bootstrap(root, ...args) {
    (root || this.root).html(this.template);
    this.model && this.defineModel(this.model, ...args);
  }
  defineModel(Model, ...args) {
    const model = new Model(...args);
    ko.applyBindings(model);
    return model;
  }
  observe(model) {
    if (Array.isArray(model)) {
      return ko.observableArray(model);
    }
    return ko.observable(model);
  }
}
