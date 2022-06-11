import { AnimatedSprite } from "../../src/core/AnimatedSprite";
import { Sprite } from "../../src/core/Sprite";
import { TextureCache } from "../../src/core/Texture";
import Ticker from "../../src/system/ticker";

export class Bullet extends Sprite {
  constructor(gl, textureBullet) {
    super(gl, textureBullet);
    this.gl = gl;
    this.textureBullet = textureBullet;
    this.transform.rotation = -Math.PI / 2;
    this.initExplosion();
  }

  setPosition(x, y) {
    this.transform.position.x = x;
    this.transform.position.y = y;
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


  updatePosition() {
    Ticker.SharedTicker.add((dt, msdt) => {
      if (!this._destroyed) {
        if (this.transform.position.y < 0) {
          this.destroy();
        }
        else {
          this.transform.position.y -= dt * 1000;
        }
      }
    });
  }

  updatePositionBoss() {
    Ticker.SharedTicker.add((dt, msdt) => {
      if (!this._destroyed) {
        if (this.transform.position.y > 900) {
          this.destroy();
        }
        else {
          this.transform.position.y += dt * 500;
        }
      }
    });
  }

  onEnemyDead() {
    this.explosion.play();
  }

}
