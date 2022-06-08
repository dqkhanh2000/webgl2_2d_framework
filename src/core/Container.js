import EventEmitter from "eventemitter3";
import Transform from "./Transform";
import * as Math from "../math/Math";

export default class Container extends EventEmitter {
  constructor() {
    super();
    this.transform = new Transform();
    this.alpha = 1;
    this.visible = true;
    this.renderable = true;

    this.parent = null;
    this.worldAlpha = 1;

    this._lastSortedIndex = 0;
    this._zIndex = 0;

    this._mask = null;
    this._maskRefCount = 0;
    this._destroyed = false;

    this.isSprite = false;
    this.isMask = false;

    this.children = [];
  }

  get destroyed() {
    return this._destroyed;
  }

  /**
     * Updates the object transform for rendering.
     */
  updateTransform() {
    this.transform.updateTransform(this.parent?.transform);
    // multiply the alphas..
    this.worldAlpha = this.alpha * (this.parent?.worldAlpha || 1);
  }

  /**
     * Set the parent Container of this Container.
     *
     * @param {Container} container - The Container to add this Container to.
     * @return - The Container that this Container was added to.
     */
  setParent(container) {
    if (!container || !container.addChild) {
      throw new Error("setParent: Argument must be a Container");
    }

    container.addChild(this);
    return container;
  }

  /**
     * Base destroy method for generic display objects. This will automatically
     * remove the display object from its parent Container as well as remove
     * all current event listeners and internal references. Do not use a Container
     * after calling `destroy()`.
     */
  destroy() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this._destroyed = true;
    this.transform = null;

    this.parent = null;
    this._bounds = null;
    this.mask = null;

    this.cullArea = null;
    this.filters = null;
    this.filterArea = null;
    this.hitArea = null;

    this.interactive = false;
    this.interactiveChildren = false;

    this.emit("destroyed");
    this.removeAllListeners();
  }

  /**
     * Adds one or more children to the container.
     *
     * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
     *
     * @param {...Container} children - The Container(s) to add to the container
     * @return {Container} - The first child that was added.
     */
  addChild(...children) {
    // if there is only one argument we can bypass looping through the them
    if (children.length > 1) {
      // loop through the array and add all children
      for (let i = 0; i < children.length; i++) {
        // eslint-disable-next-line prefer-rest-params
        this.addChild(children[i]);
      }
    }
    else {
      const child = children[0];

      if (child.parent) {
        child.parent.removeChild(child);
      }

      child.parent = this;
      this.sortDirty = true;

      this.children.push(child);

      this.onChildrenChange(this.children.length - 1);
      this.emit("childAdded", child, this, this.children.length - 1);
      child.emit("added", this);
    }

    return children[0];
  }

  /**
     * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
     *
     * @param {Container} child - The child to add
     * @param {number} index - The index to place the child in
     * @return {Container} The child that was added.
     */
  addChildAt(child, index) {
    if (index < 0 || index > this.children.length) {
      throw new Error(`${child}addChildAt: The index ${index} supplied is out of bounds ${this.children.length}`);
    }

    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;
    this.sortDirty = true;

    this.children.splice(index, 0, child);

    this.onChildrenChange(index);
    child.emit("added", this);
    this.emit("childAdded", child, this, index);

    return child;
  }

  /**
     * Swaps the position of 2 Display Objects within this container.
     *
     * @param {Container} child - First display object to swap
     * @param {Container} child2 - Second display object to swap
     */
  swapChildren(child, child2) {
    if (child === child2) {
      return;
    }

    const index1 = this.getChildIndex(child);
    const index2 = this.getChildIndex(child2);

    this.children[index1] = child2;
    this.children[index2] = child;
    this.onChildrenChange(index1 < index2 ? index1 : index2);
  }

  /**
     * Returns the index position of a child Container instance
     *
     * @param {Container} child - The Container instance to identify
     * @return - The index position of the child display object to identify
     */
  getChildIndex(child) {
    const index = this.children.indexOf(child);

    if (index === -1) {
      throw new Error("The supplied Container must be a child of the caller");
    }

    return index;
  }

  /**
   * Changes the position of an existing child in the container.
   * @param {Container} child - The child Container instance for which you want to change the index number
   * @param {number} index - The resulting index number for the child display object
   * @return {Container} The child that was moved
   */
  setChildIndex(child, index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error(`${child}setChildIndex: Index ${index} is out of bounds ${this.children.length}`);
    }

    const currentIndex = this.getChildIndex(child);

    removeItems(this.children, currentIndex, 1); // remove from old position
    this.children.splice(index, 0, child); // add at new position

    this.onChildrenChange(index);
  }

  /**
     * Removes one or more children from the container.
     *
     * @param {.Container} children - The Container(s) to remove
     * @return {Container} The first child that was removed.
     */
  removeChild(...children) {
    // if there is only one argument we can bypass looping through the them
    if (children.length > 1) {
      // loop through the arguments property and remove all children
      for (let i = 0; i < children.length; i++) {
        this.removeChild(children[i]);
      }
    }
    else {
      const child = children[0];
      const index = this.children.indexOf(child);

      if (index === -1) {
        return null;
      }

      child.parent = null;
      removeItems(this.children, index, 1);

      this.onChildrenChange(index);
      child.emit("removed", this);
      this.emit("childRemoved", child, this, index);
    }

    return children[0];
  }

  /**
    * Removes a child from the specified index position.
    *
    * @param {number} index - The index to get the child from
    * @return The child that was removed.
    */
  removeChildAt(index) {
    const child = this.getChildAt(index);

    // ensure child transform will be recalculated..
    child.parent = null;
    removeItems(this.children, index, 1);

    this.onChildrenChange(index);
    child.emit("removed", this);
    this.emit("childRemoved", child, this, index);

    return child;
  }

  /**
    * Removes all children from this container that are within the begin and end indexes.
    *
    * @param {number} beginIndex - The beginning position.
    * @param {number} endIndex - The ending position. Default value is size of the container.
    * @returns - List of removed children
    */
  removeChildren(beginIndex = 0, endIndex = this.children.length) {
    const begin = beginIndex;
    const end = endIndex;
    const range = end - begin;
    let removed;

    if (range > 0 && range <= end) {
      removed = this.children.splice(begin, range);

      for (let i = 0; i < removed.length; ++i) {
        removed[i].parent = null;
      }

      this.onChildrenChange(beginIndex);

      for (let i = 0; i < removed.length; ++i) {
        removed[i].emit("removed", this);
        this.emit("childRemoved", removed[i], this, i);
      }

      return removed;
    }
    else if (range === 0 && this.children.length === 0) {
      return [];
    }

    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  }

  /** Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex. */
  sortChildren() {
    let sortRequired = false;

    for (let i = 0, j = this.children.length; i < j; ++i) {
      const child = this.children[i];

      child._lastSortedIndex = i;

      if (!sortRequired && child.zIndex !== 0) {
        sortRequired = true;
      }
    }

    if (sortRequired && this.children.length > 1) {
      this.children.sort(sortChildren);
    }

    this.sortDirty = false;
  }

  /**
   * Render the object using the WebGL renderer
   * @param {AbstractRenderer} renderer - The renderer
   */
  render(renderer) {
    if (this.visible === false || this.alpha === 0 || !this.renderable) {
      return;
    }

    this._render(renderer);
    for (let i = 0, j = this.children.length; i < j; ++i) {
      this.children[i].render(renderer);
    }
  }

  /**
   * To be overridden by the subclass.
   * @protected
   * @param {AbstractRenderer} renderer - The renderer
   */
  // eslint-disable-next-line no-unused-vars
  _render(renderer) {
    // do nothing
  }


  get x() {
    return this.transform.position.x;
  }

  set x(value) {
    this.transform.position.x = value;
  }

  get y() {
    return this.transform.position.y;
  }

  set y(value) {
    this.transform.position.y = value;
  }

  get worldTransform() {
    return this.transform.worldTransform;
  }

  get position() {
    return this.transform.position;
  }

  set position(value) {
    this.transform.position.copy(value);
  }

  get pivot() {
    return this.transform.pivot;
  }

  set pivot(value) {
    this.transform.pivot.copy(value);
  }

  get scale() {
    return this.transform.scale;
  }

  set scale(value) {
    this.transform.scale.copy(value);
  }

  get rotation() {
    return this.transform.rotation;
  }

  set rotation(value) {
    this.transform.rotation = value;
  }

  get angle() {
    return this.transform.rotation * Math.RAD_TO_DEG;
  }

  set angle(value) {
    this.transform.rotation = value * Math.DEG_TO_RAD;
  }

  get zIndex() {
    return this._zIndex;
  }

  set zIndex(value) {
    this._zIndex = value;
  }
}


function sortChildren(a, b) {
  if (a.zIndex === b.zIndex) {
    return a._lastSortedIndex - b._lastSortedIndex;
  }

  return a.zIndex - b.zIndex;
}

/**
 * Remove items from a javascript array without generating garbage
 *
 * @function removeItems
 * @param {Array<any>} arr - Array to remove elements from
 * @param {number} startIdx - starting index
 * @param {number} removeCount - how many to remove
 */
function removeItems(arr, startIdx, removeCount) {
  const length = arr.length;
  let i;

  if (startIdx >= length || removeCount === 0) {
    return;
  }

  removeCount = (startIdx + removeCount > length ? length - startIdx : removeCount);

  const len = length - removeCount;

  for (i = startIdx; i < len; ++i) {
    arr[i] = arr[i + removeCount];
  }

  arr.length = len;
}

