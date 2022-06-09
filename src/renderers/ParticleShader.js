/* eslint-disable no-prototype-builtins */
import SimpleShader from "./SimpleShader";
import vertexShaderUpdateSrc from "./shader/particle/particleUpdate.vert";
import fragmentShaderUpdateSrc from "./shader/particle/particleUpdate.frag";
import vertexShaderRenderSrc from "./shader/particle/particleRender.vert";
import fragmentShaderRenderSrc from "./shader/particle/particleRender.frag";


export default class ParticleShader extends SimpleShader {

  constructor(gl) {
    super(gl);
    this.texture = null;
  }

  init(state) {
    this._initShaderProgram(state);
  }

  _createShaderProgram(vertexShaderSource, fragmentShaderSource, transformFeedbackVaryings) {
    this.vertexShader = this._loadAndCompileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = this._loadAndCompileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    let program = this.gl.createProgram();
    this.gl.attachShader(program, this.vertexShader);
    this.gl.attachShader(program, this.fragmentShader);

    if (transformFeedbackVaryings !== null) {
      this.gl.transformFeedbackVaryings(
        program,
        transformFeedbackVaryings,
        this.gl.INTERLEAVED_ATTRIBS,
      );
    }

    this.gl.linkProgram(program);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(`Unable to initialize the shader program: ${ this.gl.getProgramInfoLog(program)}`);
    }
    return program;
  }

  _setupParticleBufferVAO(buffers, vao) {
    this.gl.bindVertexArray(vao);

    for (let i = 0; i < buffers.length; i++) {
      let buffer = buffers[i];
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.bufferObject);
      let offset = 0;
      for (let attributeName in buffer.attribs) {
        if (buffer.attribs.hasOwnProperty(attributeName)) {

          let attributeDescription = buffer.attribs[attributeName];
          this.gl.enableVertexAttribArray(attributeDescription.location);
          this.gl.vertexAttribPointer(
            attributeDescription.location,
            attributeDescription.numComponents,
            attributeDescription.type,
            false,
            buffer.stride,
            offset,
          );

          let typeSize = 4;

          /* Note that we're cheating a little bit here: if the buffer has some irrelevant data
                    between the attributes that we're interested in, calculating the offset this way
                    would not work. However, in this demo, buffers are laid out in such a way that this code works :) */
          offset += attributeDescription.numComponents * typeSize;

          if (attributeDescription.hasOwnProperty("divisor")) { /* we'll need this later */
            this.gl.vertexAttribDivisor(attributeDescription.location, attributeDescription.divisor);
          }
        }
      }
    }
    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  _initialParticleData(numParts, minAge, maxAge) {
    var data = [];
    for (var i = 0; i < numParts; ++i) {
      data.push(0.0);
      data.push(0.0);
      var life = minAge + Math.random() * (maxAge - minAge);
      data.push(life + 1);
      data.push(life);
      data.push(0.0);
      data.push(0.0);
    }
    return data;
  }

  _initShaderProgram(state) {

    /* Create programs for updating and rendering the particle system. */
    this.updateProgram = this._createShaderProgram(
      vertexShaderUpdateSrc, fragmentShaderUpdateSrc, [
        "v_Position",
        "v_Age",
        "v_Life",
        "v_Velocity",
      ],
    );
    this.renderProgram = this._createShaderProgram(
      vertexShaderRenderSrc, fragmentShaderRenderSrc, null,
    );

    /* Capture attribute locations from program objects. */
    var updateAttributeLocations = {
      // eslint-disable-next-line camelcase
      i_Position: {
        location      : this.gl.getAttribLocation(this.updateProgram, "i_Position"),
        numComponents : 2,
        type          : this.gl.FLOAT,
      },
      // eslint-disable-next-line camelcase
      i_Age: {
        location      : this.gl.getAttribLocation(this.updateProgram, "i_Age"),
        numComponents : 1,
        type          : this.gl.FLOAT,
      },
      // eslint-disable-next-line camelcase
      i_Life: {
        location      : this.gl.getAttribLocation(this.updateProgram, "i_Life"),
        numComponents : 1,
        type          : this.gl.FLOAT,
      },
      // eslint-disable-next-line camelcase
      i_Velocity: {
        location      : this.gl.getAttribLocation(this.updateProgram, "i_Velocity"),
        numComponents : 2,
        type          : this.gl.FLOAT,
      },
    };
    var renderAttributeLocations = {
      // eslint-disable-next-line camelcase
      i_Position: {
        location      : this.gl.getAttribLocation(this.renderProgram, "i_Position"),
        numComponents : 2,
        type          : this.gl.FLOAT,
        divisor       : 1,
      },

      // eslint-disable-next-line camelcase
      i_Age: {
        location      : this.gl.getAttribLocation(this.renderProgram, "i_Age"),
        numComponents : 1,
        type          : this.gl.FLOAT,
        divisor       : 1,
      },
      // eslint-disable-next-line camelcase
      i_Life: {
        location      : this.gl.getAttribLocation(this.renderProgram, "i_Life"),
        numComponents : 1,
        type          : this.gl.FLOAT,
        divisor       : 1,
      },
    };

    this.vaos = [
      this.gl.createVertexArray(), /* for updating buffer 1 */
      this.gl.createVertexArray(), /* for updating buffer 2 */
      this.gl.createVertexArray(), /* for rendering buffer 1 */
      this.gl.createVertexArray(), /* for rendering buffer 2 */
    ];
    /* These buffers shall contain data about particles. */
    this.buffers = [
      this.gl.createBuffer(),
      this.gl.createBuffer(),
    ];
    /* We'll have 4 VAOs... */

    var spriteVertexData
    = new Float32Array([
      1, 1,
      1, 1,

      -1, 1,
      0, 1,

      -1, -1,
      0, 0,

      1, 1,
      1, 1,

      -1, -1,
      0, 0,

      1, -1,
      1, 0]);
    var spriteAttributeLocations = {
      // eslint-disable-next-line camelcase
      i_Coord: {
        location      : this.gl.getAttribLocation(this.renderProgram, "i_Coord"),
        numComponents : 2,
        type          : this.gl.FLOAT,
      },
      // eslint-disable-next-line camelcase
      i_TexCoord: {
        location      : this.gl.getAttribLocation(this.renderProgram, "i_TexCoord"),
        numComponents : 2,
        type          : this.gl.FLOAT,
      },
    };
    var spriteVertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, spriteVertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, spriteVertexData, this.gl.STATIC_DRAW);


    /* this has information about buffers and bindings for each VAO. */
    this.vaoDesc = [
      {
        vao     : this.vaos[0],
        buffers : [{
          bufferObject : this.buffers[0],
          stride       : 4 * 6,
          attribs      : updateAttributeLocations,
        }],
      },
      {
        vao     : this.vaos[1],
        buffers : [{
          bufferObject : this.buffers[1],
          stride       : 4 * 6,
          attribs      : updateAttributeLocations,
        }],
      },
      {
        vao     : this.vaos[2],
        buffers : [{
          bufferObject : this.buffers[0],
          stride       : 4 * 6,
          attribs      : renderAttributeLocations,
        },
        {
          bufferObject : spriteVertexBuffer,
          stride       : 4 * 4,
          attribs      : spriteAttributeLocations,
        }],
      },
      {
        vao     : this.vaos[3],
        buffers : [{
          bufferObject : this.buffers[1],
          stride       : 4 * 6,
          attribs      : renderAttributeLocations,
        },
        {
          bufferObject : spriteVertexBuffer,
          stride       : 4 * 4,
          attribs      : spriteAttributeLocations,
        }],
      },
    ];

    /* Populate buffers with some initial data. */
    this.initialData
            = new Float32Array(this._initialParticleData(state.numParticles, state.minAge, state.maxAge));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[0]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.initialData, this.gl.STREAM_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[1]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.initialData, this.gl.STREAM_DRAW);

    this.numParticles = this.initialData.length / 6;

    /* Set up VAOs */
    for (var i = 0; i < this.vaoDesc.length; i++) {
      this._setupParticleBufferVAO(this.vaoDesc[i].buffers, this.vaoDesc[i].vao);
    }

    /* Create a texture for random values. */
    this.rangeNoiseTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.rangeNoiseTexture);
    this.gl.texImage2D(this.gl.TEXTURE_2D,
      0,
      this.gl.RG8,
      512,
      512,
      0,
      this.gl.RG,
      this.gl.UNSIGNED_BYTE,
      randomRGData(512, 512));
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.MIRRORED_REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.MIRRORED_REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

    this.particleTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.particleTexture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA8, 32, 32, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture.texture.image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  }

  renderParticle(dt, state) {
    var numPart = state.bornParticles;
    /* Here's where birth rate parameter comes into play.
            We add to the number of active particles in the system
            based on birth rate and elapsed time. */
    if (state.pause) {
      if (numPart < 0) {
        return;
      }

      let currentNum = Math.min(state.bornParticles,
        Math.floor(state.bornParticles - state.birthRate * dt * 1000));
      state.bornParticles = currentNum;
    }
    else if (state.bornParticles < this.numParticles) {
      let currentNum = Math.min(this.numParticles,
        Math.floor(state.bornParticles + state.birthRate * dt * 1000));
      state.bornParticles = currentNum;
    }
    if (numPart <= 0) {
      return;
    }
    /* Set the previous update timestamp for calculating time delta in the
            next frame. */
    this.gl.useProgram(this.updateProgram);

    /* Most of the following is trivial setting of uniforms */
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.updateProgram, "u_TimeDelta"),
      dt,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.updateProgram, "u_TotalTime"),
      state.totalTime,
    );
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.updateProgram, "u_Gravity"),
      state.gravity[0],
      state.gravity[1],
    );
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.updateProgram, "u_Origin"),
      state.origin[0],
      state.origin[1],
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.updateProgram, "u_MinTheta"),
      state.minTheta,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.updateProgram, "u_MaxTheta"),
      state.maxTheta,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.updateProgram, "u_MinSpeed"),
      state.minSpeed,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.updateProgram, "u_MaxSpeed"),
      state.maxSpeed,
    );
    state.totalTime += dt;
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.rangeNoiseTexture);
    this.gl.uniform1i(
      this.gl.getUniformLocation(this.updateProgram, "u_RgNoise"),
      0,
    );

    /* Bind the "read" buffer - it contains the state of the particle system
            "as of now".*/
    this.gl.bindVertexArray(this.vaos[state.read]);

    /* Bind the "write" buffer as transform feedback - the varyings of the
            update shader will be written here. */
    this.gl.bindBufferBase(
      this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.buffers[state.write],
    );

    /* Since we're not actually rendering anything when updating the particle
            state, disable rasterization.*/
    this.gl.enable(this.gl.RASTERIZER_DISCARD);

    /* Begin transform feedback! */
    this.gl.beginTransformFeedback(this.gl.POINTS);
    this.gl.drawArrays(this.gl.POINTS, 0, numPart);
    this.gl.endTransformFeedback();
    this.gl.disable(this.gl.RASTERIZER_DISCARD);
    /* Don't forget to unbind the transform feedback buffer! */
    this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

    /* Now, we draw the particle system. Note that we're actually
            drawing the data from the "read" buffer, not the "write" buffer
            that we've written the updated data to. */
    this.gl.bindVertexArray(this.vaos[state.read + 2]);
    this.gl.useProgram(this.renderProgram);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.particleTexture);
    this.gl.uniform1i(
      this.gl.getUniformLocation(this.renderProgram, "u_Sprite"), 0,
    );
    this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, numPart);

    /* Finally, we swap read and write buffers. The updated state will be
            rendered on the next frame. */
    var tmp = state.read;
    state.read = state.write;
    state.write = tmp;

    /* This just loops this function. */
  }

}

function randomRGData(sizeX, sizeY) {
  let d = [];
  for (let i = 0; i < sizeX * sizeY; ++i) {
    d.push(Math.random() * 255.0);
    d.push(Math.random() * 255.0);
  }
  return new Uint8Array(d);
}
