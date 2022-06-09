import { AnimatedSprite } from "../../src/core/AnimatedSprite";
import Particle from "../../src/core/Particle";
import { TextureCache } from "../../src/core/Texture";

export class Boss extends AnimatedSprite {
  constructor(gl) {
    let textures = [];
    for (let i = 1; i <= 48; i++) {
      textures.push(TextureCache.get(`./dist/images/animation/boss/${i}.png`));
    }
    super(gl, textures, { duration: 5, loop: true, autoPlay: true });
    this.transform.rotation = -Math.PI / 2;
    this.transform.scale.set(1.5, 1.5);
    this.gl = gl;
    this.health = 200;
  }

  setPosition(x, y) {
    if (!this.destroyed) {
      this.transform.position.x = x;
      this.transform.position.y = y;
    }
  }

  updatePosition(y) {
    if (!this.destroyed) {
      this.transform.position.y += y;
    }
  }

  takeDamage() {
    this.health -= 1;
    return this.health;
  }

  getHealth() {
    return this.health;
  }

  onEnemyDead() {
    console.log("EnemyDead");
  }
}
