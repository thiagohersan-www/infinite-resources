import SimplexNoise from './simplex-noise/simplex-noise.js';
import { by_rgb } from './by_rgb.js';
import { by_hls } from './by_hls.js';

const BY_RGB = JSON.parse(by_rgb);
const BY_HLS = JSON.parse(by_hls);
const BY_COLOR = BY_RGB.concat(BY_HLS);

const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has("autoScroll");

class Strip {
  static createSvgElement(i, width, svgH, imgH, imgFile) {
    const offsetY = (imgH - svgH) / 2;
    const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    el.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    el.id = `mylayer${i}`;
    el.classList.add("layer");
    el.style.height = `${svgH}px`;
    el.innerHTML = `<defs><pattern id="img${i}" patternUnits="userSpaceOnUse" width="${width}px" height="${imgH}px" x="0" y="-${offsetY}"><image href="${imgFile}" x="0" y="0" width="${width}px" height="${imgH}px" /></pattern></defs>`;
    return el;
  }

  static getTopLayer(width) {
    const isHorizontal = window.innerWidth > window.innerHeight;
    const imgFile = `assets/imgs/map00-${isHorizontal ? "horizontal" : "vertical"}.jpg`;
    const imgWidth = isHorizontal ? 1920.0 : 1080.0;
    const imgHeight = isHorizontal ? 1300.0 : 2160.0;
    const aspectRatio = imgWidth / imgHeight;
    const height = width / aspectRatio;

    const el = Strip.createSvgElement(0, width, height, height, imgFile);
    const elPath = `<path d="M0,0 L0,${height} L${width},${height} L${width},0 z" fill="url(#img0)"></path>`;
    el.innerHTML = el.innerHTML + " " + elPath;

    return el;
  }

  static getLayer(width, height, yidx) {
    if (yidx === 0) {
      return Strip.getTopLayer(width);
    }

    const isFullWidth = width * window.devicePixelRatio > Strip.MOBILE_WIDTH;
    const isHorizontal = window.innerWidth > window.innerHeight || AUTO_SCROLL;

    const yidx0 = yidx - 1;
    const numPointsX = isFullWidth ? Strip.NUM_POINTS_X : 0.5 * Strip.NUM_POINTS_X;
    const diversityX = isHorizontal ? Strip.DIVERSITY_X : 0.5 * Strip.DIVERSITY_X;
    const deltaX = width / numPointsX;

    let pathString = `M0,${height}`;
    for (let i = 0; i <= numPointsX; i++) {
      const x = i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / diversityX, yidx0 / Strip.DIVERSITY_Y);
      const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / diversityX, yidx0 / Strip.DIVERSITY_Y);

      const y = height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
      pathString += ` L${x},${height + y}`;
    }

    for (let i = 0; i <= numPointsX; i++) {
      const x = width - i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / diversityX, (yidx0 + 1) / Strip.DIVERSITY_Y);
      const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / diversityX, (yidx0 + 1) / Strip.DIVERSITY_Y);

      const firstLayerDamp = (yidx0 === 0) ? 0.0 : 1.0;
      const y = firstLayerDamp * height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
      pathString += ` L${x},${y}`;
    }
    pathString += ` L0,${height} z`;

    const imgFile = `assets/textures/${isFullWidth ? '1920' : '1024'}/${BY_COLOR[yidx0 % BY_COLOR.length]}.jpg`
    const imgWidth = isFullWidth ? 1920.0 : 1024.0;
    const imgHeight = isFullWidth ? 640.0 : 342.0;
    const aspectRatio = imgWidth / imgHeight;
    pathString = `M0,0 L0,${height} L${width},${height} L${width},0 z`;

    const el = Strip.createSvgElement(yidx, width, height, width / aspectRatio, imgFile);
    const elPath = `<path d="${pathString}" fill="url(#img${yidx})"></path>`;
    el.innerHTML = el.innerHTML + " " + elPath;

    return el;
  }
}

// Strip.NOISE = new SimplexNoise(new Date());
Strip.NOISE = new SimplexNoise("infinitum");

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

export { Strip };
