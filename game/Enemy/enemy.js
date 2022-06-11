import { AnimatedSprite } from "../../src/core/AnimatedSprite";
import { Sprite } from "../../src/core/Sprite";
import { TextureCache } from "../../src/core/Texture";

export class Enemy extends Sprite {
  constructor(gl, textureEnemy) {
    super(gl, textureEnemy);
    this.gl = gl;
    this.textureEnemy = textureEnemy;
    this.health = 1;
    this.initExplosion();
  }

  initExplosion() {
    let textures = [];
    for (let i = 1; i <= 16; i++) {
      textures.push(TextureCache.get(`/assets/images/animation/explosion/${i}.png`));
    }
    this.explosion = new AnimatedSprite(this.gl, textures, {
      duration   : 0.5,
      loop       : false,
      autoPlay   : false,
      onComplete : () => {
        this.destroy();
      },
    });
    this.addChild(this.explosion);
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
    this.explosion.play();
  }

}
