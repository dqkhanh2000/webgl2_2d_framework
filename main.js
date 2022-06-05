import Engine2D from "./src/core/Core";
import SimpleShader from "./src/core/SimpleShader";
import VertexBuffer from "./src/core/VertexBuffer";
import vertexShaderSrc from "./src/renderers/shader/defaultProgram.vert";
import fragmentShaderSrc from "./src/renderers/shader/defaultProgram.frag";
import Color from "./src/math/Color";
import Renderable from "./src/renderers/Renderable";
import { mat3 } from "gl-matrix";

export class MyGame {
  constructor() {
    let core = new Engine2D();
    core.init("canvas");
    core.clearCanvas(Color.BLUE);
    let vertexBuffer = new VertexBuffer();
    vertexBuffer.init(core.gl);

    let shader = new SimpleShader(core.gl, vertexShaderSrc, fragmentShaderSrc);

    let rectWhite = new Renderable(core.gl, shader);
    rectWhite.color = Color.CYAN;
    rectWhite.transform.width = 500;
    rectWhite.transform.height = 500;
    rectWhite.transform.position.set(1080 / 2, 720 / 2);
    // rectWhite.transform.scale.set(1, 1);
    rectWhite.transform.pivot.set(0.5, 0.5);
    rectWhite.transform.rotation = Math.PI / 4;
    rectWhite.transform.updateTransform();
    // shader.updateTransform(matrix);
    rectWhite.draw();

    let rectBlack = new Renderable(core.gl, shader);
    rectBlack.color = Color.BLACK;
    rectBlack.transform.width = 200;
    rectBlack.transform.height = 150;
    // rectBlack.transform.position.set(250, 250);
    rectBlack.transform.scale.set(2, 1);
    rectBlack.transform.pivot.set(0.5, 0.5);
    // rectBlack.transform.pivot.set(0, 0);
    // rectBlack.transform.pivot.set(1, 1);
    rectBlack.transform.rotation = Math.PI / 2;
    rectBlack.transform.updateTransform(rectWhite.transform);

    rectBlack.draw();

    // this.shader.activateShader();

    // core.gl.drawArrays(core.gl.TRIANGLE_STRIP, 0, 4);
  }
}

// run new game when document is ready
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
