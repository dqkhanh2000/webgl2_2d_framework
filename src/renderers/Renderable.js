import Color from "../math/Color";
import SimpleShader from "../core/SimpleShader";
import Transform from "../math/Transform";

export default class Renderable {

  /**
     * @param {SimpleShader} shader - The shader to use.
     */
  constructor(gl, shader) {
    this.gl = gl;
    this.shader = shader;
    this.color = Color.WHITE;
    this.transform = new Transform();
  }

  draw(transform) {
    let matrix = this.transform.worldTransform.toArray(true);
    this.shader.activateShader(this.color);
    this.shader.updateTransform(transform || matrix);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

}
