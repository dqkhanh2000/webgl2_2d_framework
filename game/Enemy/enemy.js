import { Sprite } from "../../src/core/Sprite";

export class Enemy extends Sprite {
  constructor(gl, textureEnemy) {
    super(gl, textureEnemy);
    this.gl = gl;
    this.textureEnemy = textureEnemy;
    this.health = 10;
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
