export default class Utils {

  // eslint-disable-next-line max-params
  static rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
      return false;
    }
    return true;
  }

  static isCollision(go1, go2) {
    // eslint-disable-next-line max-len
    if (this.rectIntersect(go1.transform.position.x, go1.transform.position.y, go1.transform.width, go1.transform.height, go2.transform.position.x, go2.transform.position.y, go2.transform.width, go2.transform.height)) {
      return true;
    }
    return false;
  }
}
