class Overlay {
  constructor() {
    document.getElementById("hide-overlay-button").addEventListener("click", Overlay.hideOverlay);
    document.getElementById("my-popup").addEventListener("click", (e) => e.stopPropagation());
    document.getElementById("my-overlay").addEventListener("click", Overlay.hideOverlay);
    document.getElementById("my-info-button").addEventListener("click", Overlay.showOverlay);
  }

  static showOverlay() {
    document.getElementById("my-overlay").style.display = "flex";
    setTimeout(() => (document.getElementById("my-overlay").style.opacity = 1), 100);

    // window.removeEventListener('wheel', onScrollDesktop);
    // window.removeEventListener('touchmove', onScrollMobile);
    window.addEventListener("keyup", Overlay.checkEscKey);
  }

  static hideOverlay() {
    document.getElementById("my-overlay").style.opacity = 0;
    setTimeout(() => (document.getElementById("my-overlay").style.display = "none"), 200);

    // window.addEventListener('wheel', onScrollDesktop, { passive: false });
    // window.addEventListener('touchmove', onScrollMobile, { passive: false });
    window.removeEventListener("keyup", Overlay.checkEscKey);
  }

  static checkEscKey = (event) => {
    if (event.key && (event.key === "Escape" || event.key === "Esc")) {
      Overlay.hideOverlay();
    }
  };
}

export { Overlay };
