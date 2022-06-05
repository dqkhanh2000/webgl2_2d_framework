import Matrix2d from "./Matrix2";
import ObservableVector2d from "./ObservableVector2";

export default class Transform {
  constructor(projection) {
    this.projection = projection;
    this.worldTransform = new Matrix2d();
    this.worldTransform.identity();
    this.localTransform = new Matrix2d();
    this.localTransform.identity();

    this.position = new ObservableVector2d(0, 0, {
      onUpdate : this.onChange,
      scope    : this,
    });

    this.scale = new ObservableVector2d(1, 1, {
      onUpdate : this.onChange,
      scope    : this,
    });

    this.pivot = new ObservableVector2d(0, 0, {
      onUpdate : this.onChange,
      scope    : this,
    });

    this._rotation = 0;

    this._width = 0;
    this._height = 0;

    this._wPivot = 0;
    this._hPivot = 0;

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
    lt.scale(this._width * this.scale.x, this._height * this.scale.y);
    lt.rotate(this._rotation);
    lt.tx = this.position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
    lt.ty = this.position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));
    this._currentLocalID = this._localID;
  }

  /**
     * Updates the local and the world transformation matrices.
     *
     * @param {Transform} parentTransform - The parent transform
     */
  updateTransform(parentTransform) {
    const lt = this.localTransform;

    this.updateLocalTransform();

    if (parentTransform) {
      // concat the parent matrix with the objects transform.
      const pt = parentTransform;
      const wt = this.worldTransform;

      wt.scale(this._width * this.scale.x * pt.scale.x, this._height * this.scale.y * pt.scale.y);
      wt.rotate(this._rotation + pt.rotation);


      wt.tx = pt.worldTransform.tx - ((this.pivot.x * wt.a) + (this.pivot.y * wt.c))
          + this.position.x
          + (pt.pivot.x * pt.worldTransform.a + pt.pivot.y * pt.worldTransform.c);
      wt.ty = pt.worldTransform.ty - ((this.pivot.x * wt.b) + (this.pivot.y * wt.d))
          + this.position.y
          + (pt.pivot.x * pt.worldTransform.b + pt.pivot.y * pt.worldTransform.d);

      console.log(wt.toArray(true));

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
    }
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (this._width !== value) {
      this._width = value;
    }
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (this._height !== value) {
      this._height = value;
    }
  }

}
