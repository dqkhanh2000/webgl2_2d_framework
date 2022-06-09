import { AnimatedSprite } from "../../src/core/AnimatedSprite";
import Particle from "../../src/core/Particle";
import { TextureCache } from "../../src/core/Texture";
import { Howl, Howler } from "howler";
import { Sprite } from "../../src/core/Sprite";

export const ShipEvent = Object.freeze({
  TakeDamage : "take-damage",
  OnDead     : "on-dead",
});
export class Ship extends AnimatedSprite {
  constructor(gl) {
    let textures = [];
    for (let i = 1; i <= 16; i++) {
      textures.push(TextureCache.get(`./dist/images/animation/ship/${i}.png`));
    }
    super(gl, textures, { duration: 0.5, loop: true, autoPlay: true });
    this.gl = gl;
    this.listEnemy = [];
    this.listHealth = [];

    this.transform.position.x = this.gl.canvas.width / 2;
    this.transform.position.y = 800;
    this.transform.rotation = -Math.PI / 2;
    this.health = 3;
    this.setupGlow();
    this.initExplosion();
    this.setupHealth();

  }

  initExplosion() {
    let textures = [];
    for (let i = 1; i <= 16; i++) {
      textures.push(TextureCache.get(`./dist/images/animation/explosion/${i}.png`));
    }
    this.explosion = new AnimatedSprite(this.gl, textures, {
      duration   : 0.5,
      loop       : false,
      autoPlay   : false,
      onComplete : () => {
        this.emit(ShipEvent.OnDead, this);
      },
    });
    this.addChild(this.explosion);
  }

  setupGlow() {
    let tex = TextureCache.get("./dist/images/glow.png");
    this.particle = new Particle(tex, {
      x            : this.globalPosition.x,
      y            : this.globalPosition.y + 25,
      numParticles : 100,
      birthRate    : 1,
      minLifeRange : 0.05,
      maxLifeRange : 0.12,
      minTheta     : -Math.PI / 2,
      maxTheta     : -Math.PI / 2,
      minSpeed     : 0.5,
      maxSpeed     : 1,
      startScale   : 0.1,
      endScale     : 0.07,
      gravity      : [0.0, -0.8],
    });
    this.addChild(this.particle);
    this.particle.play();
  }

  updatePosition(x, y) {
    if (!this._destroyed) {
      this.transform.position.x = x;
      this.transform.position.y = y;
    }
  }

  updateTransform() {
    super.updateTransform();
    this.particle.x = this.globalPosition.x;
    this.particle.y = this.globalPosition.y + 25;
  }

  setupHealth() {
    let tex = TextureCache.get("./dist/images/heart.png");
    for (let i = 0; i < this.health ; i++) {
      let health = new Sprite(this.gl, tex);
      health.transform.scale.set(0.5, 0.5);
      health.transform.position.x = -70;
      health.transform.position.y = (i - 1) * 40;
      this.listHealth.push(health);
      this.addChild(health);
    }
  }

  takeDamage() {
    this.health -= 1;
    let hpLost = this.listHealth.pop();
    if (hpLost) {
      hpLost.destroy();
    }
   
    if (this.health === 0) {
      this.onDead();
    }
  }

  onDead() {
    this.explosion.play();
    var sound = new Howl({
      src    : ["../assets/audio/sfx_explosion.mp3"],
      volume : 0.5,
    });
    sound.play();
  }
}
