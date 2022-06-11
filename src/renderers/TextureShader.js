/* eslint-disable no-unused-vars */
import vertexShaderSrc from "./shader/textureProgram.vert";
import fragmentShaderSrc from "./shader/textureProgram.frag";
import SimpleShader from "./SimpleShader";
import Texture from "../core/Texture";

export default class TextureShader extends SimpleShader {

  static verticesOfSquare = [
    // 1, 1, 0,
    // 0, 1, 0,
    // 1, 0, 0,
    // 0, 0, 0,
    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,
  ];

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
    this.gl.useProgram(this.program);
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
    this.transformLocation = this.gl.getUniformLocation(this.program, "u_transform");

    this.texcoordAttributeLocation = this.gl.getAttribLocation(this.program, "a_texcoord");
    this.textureLocation = this.gl.getUniformLocation(this.program, "u_texture");
    this.alphaLocation = this.gl.getUniformLocation(this.program, "u_alpha");

    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    var size = 2; // 2 components per iteration
    var type = this.gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer

    this.positionBuffer = this.gl.createBuffer();
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(TextureShader.verticesOfSquare), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation, size, type, normalize, stride, offset,
    );

    this.texcoordBuffer = this.gl.createBuffer();
    this.gl.enableVertexAttribArray(this.texcoordAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(TextureShader.verticesOfSquare), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(
      this.texcoordAttributeLocation, size, type, normalize, stride, offset,
    );
  }

  /**
   * @param {WebGLTexture} texture - The texture to render.
   */
  activateShader(texture, blendType = Texture.BLEND_TYPE.NORMAL, alpha = 1) {
    this.gl.enable(this.gl.BLEND);
    if (blendType === Texture.BLEND_TYPE.NORMAL) {
      this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    else if (blendType === Texture.BLEND_TYPE.ADDITIVE) {
      this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
    }
    else if (blendType === Texture.BLEND_TYPE.MULTIPLY) {
      this.gl.blendFunc(this.gl.DST_COLOR, this.gl.ZERO);
    }
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);

    this.gl.uniform1f(this.alphaLocation, alpha);

    this.gl.uniform1i(this.textureLocation, 0);
    this.gl.activeTexture(this.gl.TEXTURE0 + 0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    var offset = 0;
    var count = 6;
    this.gl.drawArrays(this.gl.TRIANGLES, offset, count);
  }
}
