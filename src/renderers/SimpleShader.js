/* eslint-disable no-unused-vars */
import Color from "../math/Color";
import Transform from "../core/Transform";
import AbstractShader from "../core/AbstractShader";
import VertexBuffer from "../core/VertexBuffer";
import vertexShaderSrc from "./shader/defaultProgram.vert";
import fragmentShaderSrc from "./shader/defaultProgram.frag";

export default class SimpleShader extends AbstractShader {
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

  _initShaderProgram(vertexShaderSource, fragmentShaderSource) {
    this.vertexShader = this._loadAndCompileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = this._loadAndCompileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error(`Unable to initialize the shader program: ${ this.gl.getProgramInfoLog(this.program)}`);
    }
  }

  _initShaderAttributes() {
    this.gl.useProgram(this.program);
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
    this.transformLocation = this.gl.getUniformLocation(this.program, "u_transform");

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, VertexBuffer.vertexBuffer);
    this.gl.vertexAttribPointer(this.positionAttributeLocation,
      3, // each element is a 3-float (x,y.z)
      this.gl.FLOAT, // data type is FLOAT
      false, // if the content is normalized vectors
      0, // number of bytes to skip in between elements
      0); // offsets to the first element
  }

  _loadAndCompileShader(type, source) {
    var compiledShader;
    var gl = this.gl;

    compiledShader = gl.createShader(type);
    gl.shaderSource(compiledShader, source);
    gl.compileShader(compiledShader);
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
      throw new Error(`A shader compiling error occurred: ${
        gl.getShaderInfoLog(compiledShader)}`);
    }
    return compiledShader;
  }

  activateShader(color = Color.WHITE) {
    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.uniform4f(this.colorLocation, color.glArray[0], color.glArray[1], color.glArray[2], color.glArray[3]);
  }

  /**
   * @param {Float32Array} matrixTransform The transformation matrix to apply to the vertex positions
   */

  updateTransform(matrixTransform) {
    this.gl.uniformMatrix3fv(this.transformLocation, false, matrixTransform);
  }

  getShader() {
    return this.program;
  }
}
