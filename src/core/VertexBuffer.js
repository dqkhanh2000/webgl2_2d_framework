export default class VertexBuffer {

  static verticesOfSquare = [
    // 1, 1, 0,
    // 0, 1, 0,
    // 1, 0, 0,
    // 0, 0, 0,
    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,
  ];

  static vertexBuffer = null;

  init(gl) {
    this.gl = gl;
    VertexBuffer.vertexBuffer = this.gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(VertexBuffer.verticesOfSquare), gl.STATIC_DRAW);
  }

  initTextureCoordBuffer() {
    this.textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(VertexBuffer.verticesOfSquare), this.gl.STATIC_DRAW);
  }


}
