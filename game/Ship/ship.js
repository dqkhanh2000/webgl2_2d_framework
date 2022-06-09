import { Sprite } from "../../src/core/Sprite";

export class Ship extends Sprite {
  constructor(gl, textureShip) {
    super(gl, textureShip);
    this.gl = gl;
    this.textureShip = textureShip;
    this.transform.position.x = 100;
    this.transform.position.y = 100;
    this.transform.rotation = -Math.PI / 2;
  }

  updatePosition(x, y) {
    this.transform.position.x = x;
    this.transform.position.y = y;
  }
}
