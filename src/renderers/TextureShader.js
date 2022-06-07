/* eslint-disable no-unused-vars */
import Color from "../math/Color";
import Transform from "../math/Transform";
import AbstractShader from "../core/AbstractShader";
import VertexBuffer from "../core/VertexBuffer";
import vertexShaderSrc from "./shader/textureProgram.vert";
import fragmentShaderSrc from "./shader/textureProgram.frag";
import SimpleShader from "./SimpleShader";

export default class TextureShader extends SimpleShader {
  constructor(gl) {
    super(gl);
  }

  _initShaderAttributes() {
    super._initShaderAttributes();
    this.textureMatrixLocation = this.gl.getUniformLocation(this.program, "u_textureMatrix");
  }

  activateShader(color = Color.WHITE) {
    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.uniform4f(this.colorLocation, color.glArray[0], color.glArray[1], color.glArray[2], color.glArray[3]);
  }
}
