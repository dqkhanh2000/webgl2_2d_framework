import Color from "../math/Color";
import Vector2 from "../math/vector2";
import pool from "../system/pooling";
import Container from "./Container";
import Core from "./Core";

export default class Engine2D {

  static Core = null;

  constructor() {
    this.core = new Core();
  }

  /**
     * Initialize the engine.
     * @param {HTMLCanvasElement|string|undefined} canvas The canvas element or its id. If undefined, the default canvas element is used.
     * @returns {void}
     * @memberof Engine
    */
  init(canvas, autoResize = true) {
    this.core.init(canvas);
    this.gl = this.core.gl;
    Engine2D.Core = this.core;
    this.stage = new Container();
    this.resizeCanvasToDisplaySize();
    if (autoResize) {
      this.setAutoResize();
    }

    pool.register("Container", Container);
    pool.register("Vector2", Vector2);

  }

  update() {
    this.updateTransform();
    this.render();
  }

  updateTransform() {
    this.stage.updateTransform();
  }

  render() {
    this.clearCanvas();
    this.stage.render();
  }

  setViewport(x, y, width, height) {
    this.core.setViewport(x, y, width, height);
  }

  clearCanvas(color = Color.BLACK) {
    this.core.clearCanvas(color);
  }

  resizeCanvasToDisplaySize(multiplier) {
    let canvas = this.gl.canvas;
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      this.setViewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      this.clearCanvas();
      this.stage.resetProjection();
      return true;
    }
    return false;
  }

  setAutoResize() {
    window.addEventListener("resize", () => {
      this.resizeCanvasToDisplaySize();
    });
  }

}

