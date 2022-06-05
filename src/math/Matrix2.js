/* eslint-disable max-params */
/* eslint-disable max-len */
import pool from "../system/pooling.js";

/**
 * @classdesc
 * a Matrix2d Object.<br>
 * the identity matrix and parameters position : <br>
 * <img src="images/identity-matrix_2x.png"/>
 */
class Matrix2d {
  // eslint-disable-next-line max-params
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    this.array = this.toArray();
  }

  projection(width, height) {
    this.a = 2 / width;
    this.b = 0;
    this.c = 0;
    this.d = -2 / height;
    this.tx = -1;
    this.ty = 1;
    this.array = this.toArray();
  }

  /**
     * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
     *
     * a = array[0]
     * b = array[1]
     * c = array[3]
     * d = array[4]
     * tx = array[2]
     * ty = array[5]
     *
     * @param array - The array that the matrix will be populated from.
     */
  fromArray(array) {
    this.a = array[0];
    this.b = array[1];
    this.c = array[3];
    this.d = array[4];
    this.tx = array[2];
    this.ty = array[5];
  }

  /**
     * Sets the matrix properties.
     *
     * @param {Number} a - Matrix component
     * @param {Number} b - Matrix component
     * @param {Number} c - Matrix component
     * @param {Number} d - Matrix component
     * @param {Number} tx - Matrix component
     * @param {Number} ty - Matrix component
     * @return This matrix. Good for chaining method calls.
     */
  set(a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;

    return this;
  }

  /**
     * Creates an array from the current Matrix object.
     *
     * @param {boolean} transpose - Whether we need to transpose the matrix or not
     * @param {Float32Array} [out] - If provided the array will be assigned to out
     * @return The newly created array which contains the matrix
     */
  toArray(transpose, out) {
    if (!this.array) {
      this.array = new Float32Array(9);
    }

    const array = out || this.array;

    if (transpose) {
      array[0] = this.a;
      array[1] = this.b;
      array[2] = 0;
      array[3] = this.c;
      array[4] = this.d;
      array[5] = 0;
      array[6] = this.tx;
      array[7] = this.ty;
      array[8] = 1;
    }
    else {
      array[0] = this.a;
      array[1] = this.c;
      array[2] = this.tx;
      array[3] = this.b;
      array[4] = this.d;
      array[5] = this.ty;
      array[6] = this.tx;
      array[7] = this.ty;
      array[8] = 1;
    }

    return array;
  }

  /**
     * reset the transformation matrix to the identity matrix (no transformation).<br>
     * the identity matrix and parameters position : <br>
     * <img src="images/identity-matrix_2x.png"/>
     * @name identity
     * @memberof Matrix2d
     * @function
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  identity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;

    return this;
  }

  /**
     * set the matrix to the specified value
     * @name setTransform
     * @memberof Matrix2d
     * @function
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @param {number} e
     * @param {number} f
     * @param {number} [g=0]
     * @param {number} [h=0]
     * @param {number} [i=1]
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  setTransform(...args) {
    var a = this.array;

    if (args.length === 9) {
      a[0] = args[0]; // a - m00
      a[1] = args[1]; // b - m10
      a[2] = args[2]; // c - m20
      a[3] = args[3]; // d - m01
      a[4] = args[4]; // e - m11
      a[5] = args[5]; // f - m21
      a[6] = args[6]; // g - m02
      a[7] = args[7]; // h - m12
      a[8] = args[8]; // i - m22
    }
    else if (args.length === 6) {
      a[0] = args[0]; // a
      a[1] = args[2]; // c
      a[2] = args[4]; // e
      a[3] = args[1]; // b
      a[4] = args[3]; // d
      a[5] = args[5]; // f
      a[6] = 0; // g
      a[7] = 0; // h
      a[8] = 1; // i
    }

    return this;
  }

  /**
     * multiply both matrix
     * @name multiply
     * @memberof Matrix2d
     * @function
     * @param {Matrix2d} m the other matrix
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  multiply(m) {
    var b = m.array;
    var a = this.array;
    var a0 = a[0];
    var a1 = a[1];
    var a3 = a[3];
    var a4 = a[4];
    var b0 = b[0];
    var b1 = b[1];
    var b3 = b[3];
    var b4 = b[4];
    var b6 = b[6];
    var b7 = b[7];

    a[0] = a0 * b0 + a3 * b1;
    a[1] = a1 * b0 + a4 * b1;
    a[3] = a0 * b3 + a3 * b4;
    a[4] = a1 * b3 + a4 * b4;
    a[6] += a0 * b6 + a3 * b7;
    a[7] += a1 * b6 + a4 * b7;

    return this;
  }

  /**
     * Changes the values of the given matrix to be the same as the ones in this matrix
     *
     * @param {Matrix2d} matrix - The matrix to copy to.
     * @return The matrix given in parameter with its values updated.
     */
  copyTo(matrix) {
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;

    return matrix;
  }

  /**
    * Changes the values of the matrix to be the same as the ones in given matrix
    *
    * @param {Matrix2d} matrix - The matrix to copy from.
    * @return this
    */
  copyFrom(matrix) {
    this.a = matrix.a;
    this.b = matrix.b;
    this.c = matrix.c;
    this.d = matrix.d;
    this.tx = matrix.tx;
    this.ty = matrix.ty;

    return this;
  }

  /**
     * invert this matrix, causing it to apply the opposite transformation.
     * @name invert
     * @memberof Matrix2d
     * @function
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  invert() {
    var val = this.array;

    var a = val[0];
    var b = val[1];
    var c = val[2];
    var d = val[3];
    var e = val[4];
    var f = val[5];
    var g = val[6];
    var h = val[7];
    var i = val[8];

    var ta = i * e - f * h;
    var td = f * g - i * d;
    var tg = h * d - e * g;

    var n = a * ta + b * td + c * tg;

    val[0] = ta / n;
    val[1] = (c * h - i * b) / n;
    val[2] = (f * b - c * e) / n;

    val[3] = td / n;
    val[4] = (i * a - c * g) / n;
    val[5] = (c * d - f * a) / n;

    val[6] = tg / n;
    val[7] = (b * g - h * a) / n;
    val[8] = (e * a - b * d) / n;

    return this;
  }

  /**
    * apply the current transform to the given 2d vector
    * @name apply
    * @memberof Matrix2d
    * @function
    * @param {Vector2d} v the vector object to be transformed
    * @returns {Vector2d} result vector object.
    */
  apply(v) {
    var a = this.array;
    var x = v.x;
    var y = v.y;

    v.x = x * a[0] + y * a[3] + a[6];
    v.y = x * a[1] + y * a[4] + a[7];

    return v;
  }

  /**
     * apply the inverted current transform to the given 2d vector
     * @name applyInverse
     * @memberof Matrix2d
     * @function
     * @param {Vector2d} v the vector object to be transformed
     * @returns {Vector2d} result vector object.
     */
  applyInverse(v) {
    var a = this.array;
    var x = v.x;
    var y = v.y;

    var invD = 1 / ((a[0] * a[4]) + (a[3] * -a[1]));

    v.x = (a[4] * invD * x) + (-a[3] * invD * y) + (((a[7] * a[3]) - (a[6] * a[4])) * invD);
    v.y = (a[0] * invD * y) + (-a[1] * invD * x) + (((-a[7] * a[0]) + (a[6] * a[1])) * invD);

    return v;
  }

  /**
     * scale the matrix
     * @name scale
     * @memberof Matrix2d
     * @function
     * @param {number} x a number representing the abscissa of the scaling vector.
     * @param {number} [y=x] a number representing the ordinate of the scaling vector.
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  scale(x, y) {
    var _x = x;
    var _y = typeof (y) === "undefined" ? _x : y;

    this.a *= _x;
    this.d *= _y;
    this.c *= _x;
    this.b *= _y;
    this.tx *= _x;
    this.ty *= _y;

    return this;
  }

  /**
     * adds a 2D scaling transformation.
     * @name scaleV
     * @memberof Matrix2d
     * @function
     * @param {Vector2d} v scaling vector
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  scaleV(v) {
    return this.scale(v.x, v.y);
  }

  /**
     * specifies a 2D scale operation using the [sx, 1] scaling vector
     * @name scaleX
     * @memberof Matrix2d
     * @function
     * @param {number} x x scaling vector
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  scaleX(x) {
    return this.scale(x, 1);
  }

  /**
     * specifies a 2D scale operation using the [1,sy] scaling vector
     * @name scaleY
     * @memberof Matrix2d
     * @function
     * @param {number} y y scaling vector
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  scaleY(y) {
    return this.scale(1, y);
  }

  /**
     * rotate the matrix (counter-clockwise) by the specified angle (in radians).
     * @name rotate
     * @memberof Matrix2d
     * @function
     * @param {number} angle Rotation angle in radians.
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const a1 = this.a;
    const c1 = this.c;
    const tx1 = this.tx;

    this.a = (a1 * cos) - (this.b * sin);
    this.b = (a1 * sin) + (this.b * cos);
    this.c = (c1 * cos) - (this.d * sin);
    this.d = (c1 * sin) + (this.d * cos);
    this.tx = (tx1 * cos) - (this.ty * sin);
    this.ty = (tx1 * sin) + (this.ty * cos);

    return this;
  }

  /**
     * translate the matrix position on the horizontal and vertical axis
     * @name translate
     * @memberof Matrix2d
     * @function
     * @param {number} x the x coordindates to translate the matrix by
     * @param {number} y the y coordindates to translate the matrix by
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  translate(...args) {
    var _x;
    var _y;

    if (arguments.length === 2) {
      // x, y
      _x = args[0];
      _y = args[1];
    }
    else {
      // vector
      _x = args[0].x;
      _y = args[0].y;
    }

    this.tx += _x;
    this.ty += _y;

    return this;
  }

  /**
     * returns true if the matrix is an identity matrix.
     * @name isIdentity
     * @memberof Matrix2d
     * @function
     * @returns {boolean}
     */
  isIdentity() {
    var a = this.array;

    return (
      a[0] === 1
            && a[1] === 0
            && a[2] === 0
            && a[3] === 0
            && a[4] === 1
            && a[5] === 0
            && a[6] === 0
            && a[7] === 0
            && a[8] === 1
    );
  }

  /**
     * return true if the two matrices are identical
     * @name equals
     * @memberof Matrix2d
     * @function
     * @param {Matrix2d} m the other matrix
     * @returns {boolean} true if both are equals
     */
  equals(m) {
    var b = m.array;
    var a = this.array;

    return (
      (a[0] === b[0])
            && (a[1] === b[1])
            && (a[2] === b[2])
            && (a[3] === b[3])
            && (a[4] === b[4])
            && (a[5] === b[5])
            && (a[6] === b[6])
            && (a[7] === b[7])
            && (a[8] === b[8])
    );
  }

  /**
     * Clone the Matrix
     * @name clone
     * @memberof Matrix2d
     * @function
     * @returns {Matrix2d}
     */
  clone() {
    return pool.pull("Matrix2d", this);
  }

  /**
     * Appends the given Matrix to this Matrix.
     *
     * @param {Matrix2d} matrix - The matrix to append.
     * @return This matrix. Good for chaining method calls.
     */
  append(matrix) {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;

    this.a = (matrix.a * a1) + (matrix.b * c1);
    this.b = (matrix.a * b1) + (matrix.b * d1);
    this.c = (matrix.c * a1) + (matrix.d * c1);
    this.d = (matrix.c * b1) + (matrix.d * d1);

    this.tx = (matrix.tx * a1) + (matrix.ty * c1) + this.tx;
    this.ty = (matrix.tx * b1) + (matrix.ty * d1) + this.ty;

    return this;
  }

  /**
     * Prepends the given Matrix to this Matrix.
     *
     * @param {Matrix2d} matrix - The matrix to prepend
     * @return This matrix. Good for chaining method calls.
     */
  prepend(matrix) {
    const tx1 = this.tx;

    if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
      const a1 = this.a;
      const c1 = this.c;

      this.a = (a1 * matrix.a) + (this.b * matrix.c);
      this.b = (a1 * matrix.b) + (this.b * matrix.d);
      this.c = (c1 * matrix.a) + (this.d * matrix.c);
      this.d = (c1 * matrix.b) + (this.d * matrix.d);
    }

    this.tx = (tx1 * matrix.a) + (this.ty * matrix.c) + matrix.tx;
    this.ty = (tx1 * matrix.b) + (this.ty * matrix.d) + matrix.ty;

    return this;
  }

  /**
     * convert the object to a string representation
     * @name toString
     * @memberof Matrix2d
     * @function
     * @returns {string}
     */
  toString() {
    var a = this.array;

    return `Matrix2d(${
      a[0] }, ${ a[1] }, ${ a[2] }, ${
      a[3] }, ${ a[4] }, ${ a[5] }, ${
      a[6] }, ${ a[7] }, ${ a[8]
    })`;
  }
}

export default Matrix2d;
