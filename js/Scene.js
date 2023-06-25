class Scene {
  constructor() {
    window.scrollTo(0, 0);
    this.container = document.getElementById("my-layer-container");
    this.container.innerHTML = "";
    this.container.style.marginTop = `0px`;
  }

  getTopLayerTop() {
    return this.container.children[0].getBoundingClientRect()["top"];
  }

  getTopLayerId() {
    return parseInt(this.container.children[0].id.replace("mylayer", ""));
  }

  getBottomLayerBottom() {
    return this.container.lastChild.getBoundingClientRect()["bottom"];
  }

  getBottomLayerId() {
    return parseInt(this.container.lastChild.id.replace("mylayer", ""));
  }

  addBottom(el) {
    this.container.append(el);
  }

  addTop(el) {
    this.container.prepend(el);
    return;
  }

  removeBottom() {
    this.container.removeChild(this.container.lastChild);
  }

  removeTop() {
    this.container.removeChild(this.container.firstChild);
    return;
  }
}

export { Scene };
