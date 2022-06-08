import Color from "./src/math/Color";
import Matrix2d from "./src/math/Matrix2d";
import Texture from "./src/core/Texture";
import { Sprite } from "./src/core/Sprite";
import Ticker from "./src/system/ticker";
import Engine2D from "./src/core/Engine";
import Particle from "./src/renderers/Particle";

export class MyGame {
  constructor() {
    let core = new Engine2D();
    core.init("canvas");
    core.resizeCanvasToDisplaySize();
    // let vertexBuffer = new VertexBuffer();
    // vertexBuffer.init(core.gl);

    let texture = Texture.FromURL(core.gl, "dist/images/flamingos.png");
    texture.once("load", () => {
      let sprite = new Sprite(core.gl, texture);
      sprite.transform.position.x = 300;
      sprite.transform.position.y = 400;
      core.stage.addChild(sprite);
      

    });

    let texture2 = Texture.FromURL(core.gl, "dist/images/greengradient.png");
    texture2.once("load", () => {
      let sprite = new Sprite(core.gl, texture2);
      sprite.transform.position.x = 200;
      sprite.transform.position.y = 400;
      core.stage.addChild(sprite);
    });

    let texture3 = Texture.FromURL(core.gl, "dist/images/redgradient.png");
    texture3.once("load", () => {
      let sprite = new Sprite(core.gl, texture3);
      sprite.transform.position.x = 400;
      sprite.transform.position.y = 400;
      core.stage.addChild(sprite);
    });

    let particle = new Particle(0, 0, 1000, 0.1, 0.5, 1, Math.PI/2.0 - 0.5, Math.PI/2.0 + 0.5, 0.5, 1, [0.0, -0.8]);
    core.stage.addChild(particle);
    particle.play();

    Ticker.SharedTicker.add(() => {
      core.update();
      // particle.update();
    });
  }
}

// run new game when document is ready
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
