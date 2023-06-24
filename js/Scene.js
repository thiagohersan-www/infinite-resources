class Scene {
  constructor() {
    this.container = document.getElementById("my-layer-container");
  }

  addBottom(el) {
    this.container.append(el);
  }

  addTop(el) {
    this.container.prepend(el);
  }

  removeBottom() {
    this.container.removeChild(this.container.lastChild);
  }

  removeTop() {
    this.container.removeChild(this.container.firstChild);
  }
}

export { Scene };
