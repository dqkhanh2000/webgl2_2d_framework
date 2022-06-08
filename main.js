import Color from "./src/math/Color";
import Matrix2d from "./src/math/Matrix2d";
import Texture from "./src/core/Texture";
import { Sprite } from "./src/core/Sprite";
import Ticker from "./src/system/ticker";
import Engine2D from "./src/core/Engine";

export class MyGame {
  constructor() {
    let core = new Engine2D();
    core.init("canvas");
    core.resizeCanvasToDisplaySize();
    // let vertexBuffer = new VertexBuffer();
    // vertexBuffer.init(core.gl);

    let texture = Texture.FromURL(core.gl, "dist/images/keyboard.jpeg");
    texture.once("load", () => {
      let sprite = new Sprite(core.gl, texture);
      sprite.transform.position.x = 400;
      sprite.transform.position.y = 400;
      sprite.transform.pivot.x = 1;
      sprite.transform.pivot.y = 0.5;
      sprite.transform.rotation = Math.PI / 2;

      let sprite2 = new Sprite(core.gl, texture);
      sprite2.transform.scale.set(0.5, 0.5);
      sprite.addChild(sprite2);
      sprite2.transform.position.x = 100;
      sprite2.transform.position.y = 100;

      core.stage.addChild(sprite);

      Ticker.SharedTicker.add(() => {
        sprite.transform.rotation += 0.01;
        core.update();
      });

    });
  }
}

// run new game when document is ready
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
