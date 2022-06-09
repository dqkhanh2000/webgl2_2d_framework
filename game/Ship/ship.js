import { Sprite } from "../../src/core/Sprite";

export const ShipEvent = Object.freeze({
  TakeDamage: "take-damage",
});
export class Ship extends Sprite {
  constructor(gl, textureShip) {
    super(gl, textureShip);
    this.gl = gl;
    this.listEnemy = [];

    this.textureShip = textureShip;
    this.transform.position.x = 100;
    this.transform.position.y = 100;
    this.transform.rotation = -Math.PI / 2;

  }

  updatePosition(x, y) {
    this.transform.position.x = x;
    this.transform.position.y = y;
  }

  takeDamage() {
    console.log("take damge");
    // this.alpha -= 0.01;
  }
}
