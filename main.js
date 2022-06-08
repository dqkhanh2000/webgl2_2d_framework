import Engine2D from "./src/core/Core";
import SimpleShader from "./src/renderers/SimpleShader";
import VertexBuffer from "./src/core/VertexBuffer";
import Color from "./src/math/Color";
import Renderer from "./src/renderers/SimpleRenderer";
import Matrix2d from "./src/math/Matrix2d";
import Texture from "./src/core/Texture";
import { Sprite } from "./src/core/Sprite";

export class MyGame {
  constructor() {
    let core = new Engine2D();
    core.init("canvas");
    core.clearCanvas(Color.CYAN);
    let vertexBuffer = new VertexBuffer();
    vertexBuffer.init(core.gl);

    let texture = Texture.FromURL(core.gl, "dist/images/keyboard.jpeg");
    texture.once("load", () => {
      console.log(texture);
      let sprite = new Sprite(core.gl, texture);
      sprite.transform.projection = new Matrix2d().projection(core.gl.canvas.width, core.gl.canvas.height);
      sprite.updateTransform();
      sprite.render(core.renderer);
    });
  }
}

// run new game when document is ready
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
