import Color from "../math/Color";
import Transform from "./Transform";
import AbstractShader from "./AbstractShader";

export default class AbstractRenderer {

  /**
     * @param {AbstractShader} shader - The shader to use.
     */
  constructor(gl, shader) {
    this.gl = gl;
    this.shader = shader;
    this.shader.init();
  }

  /**
   * Draw the renderable.
   * @abstract
   */
  draw() {}
}
