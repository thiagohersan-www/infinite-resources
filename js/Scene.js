class Scene {
  constructor() {
    this.container = document.getElementById("my-layer-container");
    this.deltaY = 0;
  }

  addBottom(el) {
    this.container.append(el);
  }

  addTop(el) {
    // TODO: add element or just add content ??
    // this.container.prepend(el);
    return;
  }

  removeBottom() {
    this.container.removeChild(this.container.lastChild);
  }

  removeTop() {
    // TODO: remove element or just remove content ??
    // this.container.removeChild(this.container.firstChild);
    return;
  }

  updateY(y) {
    this.deltaY = Math.max(0, this.deltaY + y);
  }
}

export { Scene };
