/* eslint-disable max-params */
/* eslint-disable max-len */
import { mat3 } from "gl-matrix";
import pool from "../system/pooling.js";
import Vector2 from "./vector2.js";

/**
 * @classdesc
 * a Matrix2d Object.
 */
export default class Matrix2d {
  // eslint-disable-next-line max-params
  constructor() {
    this.array = new Float32Array(9);
    this.identity();
  }

  projection(width, height) {
    mat3.projection(this.array, width, height);
    return this;
  }

  /**
     * Creates a Matrix object based on the given array
     *
     * @param {Float32Array} array - The array that the matrix will be populated from.
     */
  fromArray(array) {
    this.array.set(array);
  }

  /**
     * Creates an array from the current Matrix object.
     * @param {Float32Array} [out] - If provided the array will be assigned to out
     * @return The newly created array which contains the matrix
     */
  toArray(out) {
    if (out === undefined) {
      out.set(this.array);
    }
    return this.array;
  }

  /**
     * reset the transformation matrix to the identity matrix (no transformation).
     * @name identity
     * @memberof Matrix2
     * @function
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  identity() {
    mat3.identity(this.array);
    return this;
  }

  /**
     * multiply both matrix
     * @name multiply
     * @memberof Matrix2
     * @function
     * @param {Matrix2d} m the other matrix
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  multiply(m) {
    mat3.multiply(this.array, this.array, m.array);
    return this;
  }

  /**
     * Changes the values of the given matrix to be the same as the ones in this matrix
     *
     * @param {Matrix2d} matrix - The matrix to copy to.
     * @return The matrix given in parameter with its values updated.
     */
  copyTo(matrix) {
    matrix.array.set(this.array);
    return matrix;
  }

  /**
    * Changes the values of the matrix to be the same as the ones in given matrix
    *
    * @param {Matrix2d} matrix - The matrix to copy from.
    * @return this
    */
  copyFrom(matrix) {
    this.array.set(matrix.array);
    return this;
  }

  /**
     * invert this matrix, causing it to apply the opposite transformation.
     * @name invert
     * @memberof Matrix2
     * @function
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  invert() {
    mat3.invert(this.array, this.array);

    return this;
  }

  /**
   * Apply the transform of matrix from a point
   * @name apply
   * @memberof Matrix2
   * @function
   * @param {Vector2} vec the point to transform
   * @return {Matrix2d} the transformed matrix
    */
  apply(vec) {
    this.translate(vec);
    return this;
  }

  /**
     * scale the matrix
     * @name scale
     * @memberof Matrix2
     * @function
     * @param {number} x a number representing the abscissa of the scaling vector.
     * @param {number} [y=x] a number representing the ordinate of the scaling vector.
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  scale(x, y) {
    var _x = x;
    var _y = typeof (y) === "undefined" ? _x : y;

    mat3.scale(this.array, this.array, [_x, _y]);

    return this;
  }

  /**
     * rotate the matrix (counter-clockwise) by the specified angle (in radians).
     * @name rotate
     * @memberof Matrix2
     * @function
     * @param {number} angle Rotation angle in radians.
     * @returns {Matrix2d} Reference to this object for method chaining
     */
  rotate(angle) {
    mat3.rotate(this.array, this.array, angle);
    return this;
  }

  /**
     * translate the matrix position on the horizontal and vertical axis
     * @name translate
     * @memberof Matrix2
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

    mat3.translate(this.array, this.array, [_x, _y]);

    return this;
  }

  /**
     * returns true if the matrix is an identity matrix.
     * @name isIdentity
     * @memberof Matrix2
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
     * @memberof Matrix2
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
     * @memberof Matrix2
     * @function
     * @returns {Matrix2d}
     */
  clone() {
    return pool.pull("Matrix2", this);
  }

  /**
     * Appends the given Matrix to this Matrix.
     *
     * @param {Matrix2d} matrix - The matrix to append.
     * @return This matrix. Good for chaining method calls.
     */
  append(matrix) {
    mat3.multiply(this.array, this.array, matrix.array);
    return this;
  }

  /**
     * convert the object to a string representation
     * @name toString
     * @memberof Matrix2
     * @function
     * @returns {string}
     */
  toString() {
    var a = this.array;

    return `Matrix2(${
      a[0] }, ${ a[1] }, ${ a[2] }, ${
      a[3] }, ${ a[4] }, ${ a[5] }, ${
      a[6] }, ${ a[7] }, ${ a[8]
    })`;
  }
}
