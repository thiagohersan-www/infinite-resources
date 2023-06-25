class Scene {
  constructor() {
    window.scrollTo(0, 0);
    this.container = document.getElementById("my-layer-container");
    this.container.innerHTML = "";
    this.container.style.marginTop = `0px`;
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
}

export { Scene };
