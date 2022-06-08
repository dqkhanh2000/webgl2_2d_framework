import Color from "../math/Color";
import AbstractRenderer from "../core/AbstractRenderer";

export default class Renderer extends AbstractRenderer {

  /**
     * @param {SimpleShader} shader - The shader to use.
     */
  constructor(gl, shader) {
    super(gl, shader);
    this.color = Color.WHITE;
  }

  draw() {
    let matrix = this.transform.worldTransform.array;
    this.shader.activateShader(this.color);
    this.shader.updateTransform(matrix);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
