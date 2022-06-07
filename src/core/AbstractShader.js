/* eslint-disable no-unused-vars */
import Transform from "../math/Transform";

/**
 * @class
 * @property {WebGLRenderingContext} gl - The WebGL rendering context.
 * @property {Transform} transform - The transform of the object.
 * @property {WebGLProgram} program - The shader program.
 */
export default class AbstractShader {

  /**
   * @param {WebGL2RenderingContext} gl - The WebGL2RenderingContext.
   */
  constructor(gl) {
    this.gl = gl;
    this.program = null;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.positionAttributeLocation = null;
    this.transform = null;
  }

  /**
   * init the shader.
   * @abstract
   * @memberof IShader
   */
  init() {}

  /**
   * init the shader program.
   * @private
   * @abstract
   * @memberof IShader
   */
  _initShaderProgram() {}

  /**
   * init the shader attributes.
   */
  _initShaderAttributes() {}

  /**
   * load and compile the shader.
   * @param {number} type - The shader type.
   * @param {string} source - The shader source.
   * @returns {WebGLShader} - The compiled shader.
   * @private
   * @abstract
   * @memberof IShader
   */
  _loadAndCompileShader(type, source) {}

  /**
   * activate the shader.
   */
  activateShader() {}

  /**
   * @param {Transform} matrixTransform The transformation matrix to apply to the vertex positions
   */
  updateTransform(matrixTransform) {}
}

