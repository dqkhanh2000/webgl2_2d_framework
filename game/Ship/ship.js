import { AnimatedSprite } from "../../src/core/AnimatedSprite";
import { Sprite } from "../../src/core/Sprite";
import { TextureCache } from "../../src/core/Texture";

export const ShipEvent = Object.freeze({
  TakeDamage: "take-damage",
});
export class Ship extends AnimatedSprite {
  constructor(gl) {
    let textures = [];
    for (let i = 1; i <= 16; i++) {
      textures.push(TextureCache.get(`./dist/images/ship/ship_${i}.png`));
    }
    super(gl, textures, { duration: 0.2, loop: true, autoPlay: true });
    this.gl = gl;
    this.listEnemy = [];

    this.transform.position.x = 100;
    this.transform.position.y = 100;
    this.transform.scale.set(1, 1.5);
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
