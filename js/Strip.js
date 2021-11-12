import SimplexNoise from './simplex-noise/simplex-noise.js';
import * as THREE from './three/three.module.js';

class Strip {
  static getMesh(width, height, yidx) {
    const mLoader = new THREE.TextureLoader();
    const tFilename = `./assets/texture${('000' + yidx % 16).slice(-2)}.jpg`;

    const mTexture = mLoader.load(tFilename, (texture) => {
      const shape = {
        width: width,
        height: height + (Strip.AMPLITUDE * height * 2)
      };

      const shapeAspect = shape.width / shape.height;
      const imageAspect = texture.image.width / texture.image.height;

      shape.width = Math.max(shape.width, shape.height * imageAspect);
      shape.height = shape.width / shapeAspect;

      const repeatX = 1 / shape.width;
      const repeatY = imageAspect / shape.width;
      texture.repeat.set(repeatX, repeatY);

      const imageHeightInShapeUnits = shape.width / imageAspect;
      const offsetX = repeatX * 0.5 * (shape.width - width);
      const offsetY = repeatY * 0.5 * (imageHeightInShapeUnits - height);
      texture.offset.set(offsetX, offsetY);
    });

    const mShape = new THREE.Shape();
    const deltaX = width / Strip.NUM_POINTS_X;

    mShape.moveTo(0, height);
    for (let i = 0; i <= Strip.NUM_POINTS_X; i++) {
      const x = i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / Strip.DIVERSITY_X, yidx / Strip.DIVERSITY_Y);
      const y = (yidx === 0) ? height : height * (1 + Strip.AMPLITUDE * y_noise);
      mShape.lineTo(x, y);
    }

    for (let i = 0; i <= Strip.NUM_POINTS_X; i++) {
      const x = width - i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / Strip.DIVERSITY_X, (yidx + 1) / Strip.DIVERSITY_Y);
      const y = height * Strip.AMPLITUDE * y_noise;
      mShape.lineTo(x, y);
    }
    mShape.lineTo(0, height);

    const mMesh = new THREE.Mesh(new THREE.ShapeGeometry(mShape),
      new THREE.MeshBasicMaterial({ map: mTexture })
    );

    mMesh.position.set(0, -yidx * height);

    return mMesh;
  }
}

// Strip.NOISE = new SimplexNoise(new Date());
Strip.NOISE = new SimplexNoise('new Date()');

Strip.NUM_POINTS_X = 256.0;

// amp: 0.6 - (1.0)
Strip.AMPLITUDE = 1.0;

// x-diversity: 200 - (160)
Strip.DIVERSITY_X = 160.0;

// y-diversity: 45 - (20)
Strip.DIVERSITY_Y = 20.0;

Strip.counter = 0;

export { Strip };
