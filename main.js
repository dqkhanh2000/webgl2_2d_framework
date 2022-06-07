import Engine2D from "./src/core/Core";
import SimpleShader from "./src/renderers/SimpleShader";
import VertexBuffer from "./src/core/VertexBuffer";
import Color from "./src/math/Color";
import Renderable from "./src/renderers/Renderable";
import { mat3 } from "gl-matrix";
import Matrix2d from "./src/math/Matrix2d";

export class MyGame {
  constructor() {
    let core = new Engine2D();
    core.init("canvas");
    core.clearCanvas(Color.BLUE);
    let vertexBuffer = new VertexBuffer();
    vertexBuffer.init(core.gl);

    let shader = new SimpleShader(core.gl);

    let rectWhite = new Renderable(core.gl, shader);
    rectWhite.color = Color.CYAN;
    rectWhite.transform.width = 300;
    rectWhite.transform.height = 200;
    rectWhite.transform.projection = new Matrix2d().projection(1920, 1080);
    
    rectWhite.transform.position.set(1920 / 2, 1080 / 2);
    // rectWhite.transform.scale.set(2, 2);
    rectWhite.transform.pivot.set(0.5, 0.5);    // rectWhite.transform.rotation = Math.PI / 4;
    rectWhite.transform.updateTransform();
    // shader.updateTransform(matrix);
    rectWhite.draw();

    let rect2 = new Renderable(core.gl, shader);
    rect2.color = Color.BLACK;
    rect2.transform.width = 200;
    rect2.transform.height = 150;
    rect2.transform.projection = new Matrix2d().projection(1920, 1080);
    // rect2.transform.position.set(1080 / 2, 720 / 2);
    // rect2.transform.scale.set(1, 1);
    rect2.transform.pivot.set(0.5, 0.5);
    // rect2.transform.rotation = Math.PI / 4;
    rect2.transform.updateTransform(rectWhite.transform);
    // shader.updateTransform(matrix);
    rect2.draw();

    // this.shader.activateShader();

    // core.gl.drawArrays(core.gl.TRIANGLE_STRIP, 0, 4);
  }
}

// run new game when document is ready
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
