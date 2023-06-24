const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has("autoScroll");

class Strip {
  static fakeEl(i, h) {
    const el = document.createElement("div");
    el.innerHTML = `${i}`;
    el.classList.add("layer");
    el.style.height = `${h}px`;
    return el;
  }

  static getTopMesh(width, stripHeight) {
    const isHorizontal = window.innerWidth > window.innerHeight;
    // TODO: load mountain image
    return Strip.fakeEl(0, stripHeight);
  }

  static getMesh(width, height, yidx) {
    if (yidx === 0) {
      return Strip.getTopMesh(width, height);
    }

    const isFullWidth = width * window.devicePixelRatio > Strip.MOBILE_WIDTH;
    const isHorizontal = window.innerWidth > window.innerHeight || AUTO_SCROLL;

    yidx = yidx - 1;
    const numPointsX = isFullWidth ? Strip.NUM_POINTS_X : 0.5 * Strip.NUM_POINTS_X;
    const diversityX = isHorizontal ? Strip.DIVERSITY_X : 0.5 * Strip.DIVERSITY_X;
    const deltaX = width / numPointsX;

    // TODO: create SVG with image pattern
    for (let i = 0; i <= numPointsX; i++) {
      const x = i * deltaX;

      // TODO: LX,Y
      // const y_noise = Strip.NOISE.noise2D(x / diversityX, yidx / Strip.DIVERSITY_Y);
      // const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / diversityX, yidx / Strip.DIVERSITY_Y);

      // const firstLayerDamp = (yidx === 0) ? 0.5 : 1.0;
      // const y = firstLayerDamp * height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
    }

    for (let i = 0; i <= numPointsX; i++) {
      const x = width - i * deltaX;

      // TODO: LX,Y
      // const y_noise = Strip.NOISE.noise2D(x / diversityX, (yidx + 1) / Strip.DIVERSITY_Y);
      // const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / diversityX, (yidx + 1) / Strip.DIVERSITY_Y);

      // const y = height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
    }

    return Strip.fakeEl(yidx + 1, height);
  }
}

// Strip.NOISE = new SimplexNoise(new Date());
// Strip.NOISE = new SimplexNoise("infinitum");

Strip.MOBILE_WIDTH = 1090;

Strip.NUM_POINTS_X = 256.0;

// amp: 0.6 - (1.0)
Strip.AMPLITUDE = 0.7;

// x-diversity: 200 - (160)
Strip.DIVERSITY_X = 180.0;

Strip.DIVERSITY_X_HIGH_FACTOR = 4.0;
Strip.DIVERSITY_X_HIGH_AMP = 0.2;

// y-diversity: 45 - (20)
Strip.DIVERSITY_Y = 20.0;

Strip.SPACER = 0;

export { Strip };
