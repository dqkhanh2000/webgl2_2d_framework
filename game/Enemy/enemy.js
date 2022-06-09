import { Sprite } from "../../src/core/Sprite";

export class Enemy extends Sprite {
  constructor(gl, textureEnemy) {
    super(gl, textureEnemy);
    this.gl = gl;
    this.textureEnemy = textureEnemy;
  }

  setPosition(x, y) {
    this.transform.position.x = x;
    this.transform.position.y = y;
  }

  updatePosition(y) {
    this.transform.position.y += y;
  }
}
