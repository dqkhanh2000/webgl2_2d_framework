import Core from "./Core";
import VertexBuffer from "./VertexBuffer";

export class Engine2D {
  constructor() {
    this.core = new Core();
    this.gl = null;
    this.vertexBuffer = new VertexBuffer();
  }

  /**
     * Initialize the engine.
     * @param {HTMLCanvasElement|string|undefined} canvas The canvas element or its id. If undefined, the default canvas element is used.
     * @returns {void}
     * @memberof Engine
    */
  init(canvas) {
    this.core.init(canvas);
    this.gl = this.core.gl;
    this.vertexBuffer.init(this.gl);
  }

  update() {

  }

  draw() {

  }
}

