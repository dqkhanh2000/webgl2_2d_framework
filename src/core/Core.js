import Color from "../math/Color";

/**
 * @classdesc
 * The core of the engine.
 * @class
 * @param {WebGL2RenderingContext} gl - The WebGL2RenderingContext to use.
 */
export default class Core {

  static get GL() {
    return this._gl;
  }

  constructor() {
    this.gl = null;
  }

  /**
     * Initialize the WebGL context.
     * @param {HTMLCanvasElement|string|undefined} canvas The canvas element or its id. If undefined, the default canvas element is used.
     * @returns {void}
     * @memberof Engine
    */
  init(canvas) {
    if (typeof canvas === "string") {
      canvas = document.getElementById(canvas);
    }
    else if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "canvas";
      document.body.appendChild(canvas);
    }
    else if (typeof canvas !== HTMLCanvasElement) {
      throw new Error("The canvas parameter must be a HTMLCanvasElement or a string.");
    }

    this.gl = canvas.getContext("webgl2");
    if (!this.gl) {
      throw new Error("Could not initialise WebGL, sorry :-(");
    }
  }

  /** Clear the canvas.
     * @param {Color} color The color to clear the canvas with.
     * @returns {void}
     * @memberof Engine
     */
  clearCanvas(color = Color.BLACK) {
    this.gl.clearColor(color.glArray[0], color.glArray[1], color.glArray[2], color.glArray[3]);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

}
