import Matrix2d from "../math/Matrix2d";
import Vector2 from "../math/vector2";

export default class Transform {

  /**
   * @param {Matrix2d} projection - The projection matrix.
   */
  constructor(projection, isTexture = false, isText = false) {
    this._projection = projection;
    this.worldTransform = new Matrix2d().identity();
    this._originWorldTransform = new Matrix2d().identity();
    this.localTransform = new Matrix2d().identity();
    this._originLocalTransform = new Matrix2d().identity();

    this.position = new Vector2();
    this.scale = new Vector2(1, 1);

    this.pivot = new Vector2();

    if (isTexture) {
      this.isTexture = true;
      this.pivot.set(0.5, 0.5);
    }

    this.isText = isText;

    this._rotation = 0;
    this._width = 0;
    this._height = 0;
    this._wPivot = 0;
    this._hPivot = 0;
    this.alpha = 1;

    this.isDirty = true;

    this.parent = null;

  }

  onChange() {

  }

  toString() {
    return "[math:Transform "
            + `position=(${this.position.x}, ${this.position.y}) `
            + `rotation=${this.rotation} `
            + `scale=(${this.scale.x}, ${this.scale.y}) `
            + "]";
  }

  /** Updates the local transformation matrix. */
  updateLocalTransform() {
    const lt = this.localTransform;
    lt.copyFrom(this._originLocalTransform);
    lt.translate(this.pivot);
    lt.translate(this.position);
    lt.rotate(this._rotation);
    lt.scale((this._width || 1) * this.scale.x, (this._height || 1) * this.scale.y);
    if (this.isText) {
      lt.scale(-1, 1);
    }
    lt.translate(-this.pivot.x, -this.pivot.y);
  }

  updateTextureMatrix() {
    // this.textureMatrix[0] = this._width;
    // this.textureMatrix[5] = this._height;

  }

  /**
     * Updates the local and the world transformation matrices.
     *
     * @param {Transform} parentTransform - The parent transform
     * @param {Vector2} parentGlobalPosition - The parent global position
     */
  updateTransform(parentTransform) {
    const lt = this.localTransform;
    this.updateLocalTransform();

    if (parentTransform) {
      let wt = this.worldTransform;
      wt.copyFrom(this.parent.worldTransform);
      wt.translate(this.pivot.x, this.pivot.y);
      wt.translate(this.position.x / (this.parent.width || 1), this.position.y / (this.parent.height || 1));
      wt.scale((this._width || 1) * this.scale.x / (this.parent.width || 1), (this._height || 1) * this.scale.y / (this.parent.height || 1));
      wt.rotate(this._rotation);
      if (this.isText) {
        wt.scale(-1, 1);
      }
      wt.translate(-this.pivot.x, -this.pivot.y);
    }
    else {
      this.worldTransform.copyFrom(lt);
    }
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    if (this._rotation !== value) {
      this._rotation = value;
      this.isDirty = true;
    }
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (this._width !== value) {
      this._width = value;
      this.isDirty = true;
    }
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (this._height !== value) {
      this._height = value;
      this.isDirty = true;
    }
  }

  get projection() {
    return this._projection;
  }

  set projection(value) {
    if (value && this._projection !== value) {
      this._projection = value;
      this._originLocalTransform.identity().multiply(this._projection);
      this._originWorldTransform.identity().multiply(this._projection);
      this.isDirty = true;
    }
  }

  set textureMode(value) {
    if (typeof value === "boolean") {
      this.isTexture = value;
      if (value) {
        this.isTexture = true;
        this.pivot.set(0.5, 0.5);
      }
    }
  }

  get globalPosition() {
    if (this.parent) {
      return this.parent.globalPosition.add(this.position);
    }
    else {
      return this.position.clone();
    }
  }

  get globalScale() {
    if (this.parent) {
      return this.parent.globalScale.multiply(this.scale);
    }
    else {
      return this.scale.clone();
    }
  }

  get globalRotation() {
    if (this.parent) {
      return this.parent.globalRotation + this.rotation;
    }
    else {
      return this.rotation;
    }
  }

  get globalAlpha() {
    if (this.parent) {
      return this.parent.globalAlpha * this.alpha;
    }
    else {
      return this.alpha;
    }
  }

  get globalPivot() {
    if (this.parent) {
      return this.parent.globalPivot.add(this.pivot);
    }
    else {
      return this.pivot.clone();
    }
  }
}
