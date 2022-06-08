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

    // let texture = Texture.FromURL(core.gl, "dist/images/sad.png");
    // texture.once("load", () => {
    //   let sprite = new Sprite(core.gl, texture);
    //   sprite.transform.position.x = 400;
    //   sprite.transform.position.y = 400;
    //   sprite.transform.pivot.x = 1;
    //   sprite.transform.pivot.y = 0.5;
    //   sprite.transform.rotation = Math.PI / 2;

    // });
    let particle = new Particle(core.gl, 400, 400, 100, 0.5, 1, 1.1, -Math.PI, Math.PI, 0.5, 1, [0, 0]);
    // sprite.addChild(particle);
    core.stage.addChild(particle);
    particle.play();

    Ticker.SharedTicker.add(() => {
      core.update();
    });
  }
}

// run new game when document is ready
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
