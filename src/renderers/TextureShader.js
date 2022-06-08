/* eslint-disable no-unused-vars */
import Color from "../math/Color";
import Transform from "../core/Transform";
import AbstractShader from "../core/AbstractShader";
import VertexBuffer from "../core/VertexBuffer";
import vertexShaderSrc from "./shader/textureProgram.vert";
import fragmentShaderSrc from "./shader/textureProgram.frag";
import SimpleShader from "./SimpleShader";

export default class TextureShader extends SimpleShader {
  constructor(gl) {
    super(gl);
  }

  /**
   * init the shader.
   * @override
   */
  init() {
    this._initShaderProgram(vertexShaderSrc, fragmentShaderSrc);
    this._initShaderAttributes();
  }

  _initShaderAttributes() {
    super._initShaderAttributes();
    this.textureMatrixLocation = this.gl.getUniformLocation(this.program, "u_textureMatrix");
  }

  /**
   * @param {WebGLTexture} texture - The texture to render.
   */
  activateShader(texture) {
    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.uniform1i(this.textureLocation, 0);
    this.gl.activeTexture(this.gl.TEXTURE0 + 0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    console.log(this.transform.worldTransform.array);
    this.gl.uniformMatrix4fv(this.textureMatrixLocation, false, this.transform.textureMatrix);
  }
}
