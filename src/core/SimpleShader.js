import { mat3 } from "gl-matrix";
import Color from "../math/Color";
import VertexBuffer from "./VertexBuffer";

export default class SimpleShader {
  constructor(gl, vertexShaderSource, fragmentShaderSource) {
    this.gl = gl;
    this.transform = mat3.identity(mat3.create());
    this._init(vertexShaderSource, fragmentShaderSource);
  }

  _init(vertexShaderSource, fragmentShaderSource) {
    this.vertexSHader = this._loadAndCompileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentSHader = this._loadAndCompileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.vertexSHader);
    this.gl.attachShader(this.program, this.fragmentSHader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error(`Unable to initialize the shader program: ${ this.gl.getProgramInfoLog(this.program)}`);
    }

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
   * @param {mat3} matrixTransform The transformation matrix to apply to the vertex positions
   */
  updateTransform(matrixTransform) {
    this.transform = matrixTransform;
    this.gl.uniformMatrix3fv(this.transformLocation, false, matrixTransform);
  }

  getShader() {
    return this.program;
  }
}
