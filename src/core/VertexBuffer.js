export default class VertexBuffer {

  static verticesOfSquare = [
    1, 1, 0.0,
    0, 1, 0.0,
    1, 0, 0.0,
    0, 0, 0.0,
  ];

  static vertexBuffer = null;

  init(gl) {
    this.gl = gl;
    VertexBuffer.vertexBuffer = this.gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(VertexBuffer.verticesOfSquare), gl.STATIC_DRAW);
  }


}
