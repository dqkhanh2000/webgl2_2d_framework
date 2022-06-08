import Color from "../math/Color";
import Container from "../core/Container";
import vertexShaderUpdateSrc from "./shader/particle/particleUpdate.vert";
import fragmentShaderUpdateSrc from "./shader/particle/particleUpdate.frag";
import vertexShaderRenderSrc from "./shader/particle/particleRender.vert";
import fragmentShaderRenderSrc from "./shader/particle/particleRender.frag";
import Ticker from "../system/ticker";

export default class Particle extends Container {

  constructor(gl, x, y, numParticles, birthRate, minLifeRange, maxLifeRange, minTheta, maxTheta, minSpeed, maxSpeed, gravity) {
    super(gl, x, y, numParticles, birthRate, minLifeRange, maxLifeRange, minTheta, maxTheta, minSpeed, maxSpeed, gravity);
    this.gl = gl;
    this.numParticles = numParticles;
    this.birthRate = birthRate;
    this.minLifeRange = minLifeRange;
    this.maxLifeRange = maxLifeRange;
    this.minTheta = minTheta;
    this.maxTheta = maxTheta;
    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;
    this.gravity = gravity;
    this.canPlay = false;
    if (this.gl != null) {
      this.state = this.init();
      this.state.origin = [x, y];
    }
    else {
      document.write("WebGL2 is not supported by your browser");
    }
  }

  play() {
    this.canPlay = true;
  }

  _render() {
    if (this.canPlay) {
      this.renderParticle(Ticker.SharedTicker.deltaMS);
    }
  }

  // createShader(shader_info) {
  //     var shader = this.gl.createShader(shader_info.type);
  //     var i = 0;
  //     var shader_source = document.getElementById(shader_info.name).text;
  //     /* skip whitespace to avoid glsl compiler complaining about
  //         #version not being on the first line*/
  //     while (/\s/.test(shader_source[i])) i++;
  //     shader_source = shader_source.slice(i);
  //     this.gl.shaderSource(shader, shader_source);
  //     this.gl.compileShader(shader);
  //     var compile_status = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
  //     if (!compile_status) {
  //         var error_message = this.gl.getShaderInfoLog(shader);
  //         throw "Could not compile shader \"" +
  //             shader_info.name +
  //             "\" \n" +
  //             error_message;
  //     }
  //     return shader;
  // }

  /* Creates an OpenGL program object.
    `gl' shall be a WebGL 2 context.
    `shader_list' shall be a list of objects, each of which have a `name'
    and `type' properties. `name' will be used to locate the script tag
    from which to load the shader. `type' shall indicate shader type (i. e.
    gl.FRAGMENT_SHADER, gl.VERTEX_SHADER, etc.)
    `transform_feedback_varyings' shall be a list of varying that need to be
    captured into a transform feedback buffer.*/
  createGLProgram(vertexShaderSource, fragmentShaderSource, transform_feedback_varyings) {
    this.vertexShader = this._loadAndCompileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = this._loadAndCompileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);

    /* Specify varyings that we want to be captured in the transform
            feedback buffer. */
    if (transform_feedback_varyings != null) {
      this.gl.transformFeedbackVaryings(
        this.program,
        transform_feedback_varyings,
        this.gl.INTERLEAVED_ATTRIBS,
      );
    }

    this.gl.linkProgram(this.program);
    var link_status = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if (!link_status) {
      var error_message = this.gl.getProgramInfoLog(this.program);
      throw `Could not link this.program.\n${ error_message}`;
    }
    return this.program;
  }

  _loadAndCompileShader(type, source) {
    var compiledShader;
    var gl = this.gl;

    compiledShader = gl.createShader(type);
    gl.shaderSource(compiledShader, source);
    gl.compileShader(compiledShader);
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
      throw new Error(`A shader compiling error occurred: ${
        gl.getShaderInfoLog(compiledShader)}`);
    }
    return compiledShader;
  }

  randomRGData(size_x, size_y) {
    var d = [];
    for (var i = 0; i < size_x * size_y; ++i) {
      d.push(Math.random() * 255.0);
      d.push(Math.random() * 255.0);
    }
    return new Uint8Array(d);
  }

  initialParticleData() {
    var data = [];
    for (var i = 0; i < this.numParticles; ++i) {
      // position
      data.push(0.0);
      data.push(0.0);

      var life = this.minLifeRange + Math.random() * (this.maxLifeRange - this.minLifeRange);
      // set age to max. life + 1 to ensure the particle gets initialized
      // on first invocation of particle update shader
      data.push(life + 1);
      data.push(life);

      // velocity
      data.push(0.0);
      data.push(0.0);
    }
    return data;
  }

  /*
    This is a helper function used by the main initialization function.
    It sets up a vertex array object based on the given buffers and attributes
    they contain.
    If you're familiar with VAOs, following this should be easy.
    */
  setupParticleBufferVAO(buffers, vao) {
    this.gl.bindVertexArray(vao);
    for (var i = 0; i < buffers.length; i++) {
      var buffer = buffers[i];
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer_object);
      var offset = 0;
      for (var attrib_name in buffer.attribs) {
        if (buffer.attribs.hasOwnProperty(attrib_name)) {
          /* Set up vertex attribute pointers for attributes that are stored in this buffer. */
          var attrib_desc = buffer.attribs[attrib_name];
          this.gl.enableVertexAttribArray(attrib_desc.location);
          this.gl.vertexAttribPointer(
            attrib_desc.location,
            attrib_desc.num_components,
            attrib_desc.type,
            false,
            buffer.stride,
            offset,
          );
          /* we're only dealing with types of 4 byte size in this demo, unhardcode if necessary */
          var type_size = 4;

          /* Note that we're cheating a little bit here: if the buffer has some irrelevant data
                    between the attributes that we're interested in, calculating the offset this way
                    would not work. However, in this demo, buffers are laid out in such a way that this code works :) */
          offset += attrib_desc.num_components * type_size;

          if (attrib_desc.hasOwnProperty("divisor")) { /* we'll need this later */
            this.gl.vertexAttribDivisor(attrib_desc.location, attrib_desc.divisor);
          }
        }
      }
    }
    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  /*
    * The main initialization function.
    * Returns an object representing a particle system with the given parameters.
    * `gl' shall be a valid WebGL 2 context.
    * `particle_birth_rate' defines the number of particles born per millisecond.
    * `num_particles' shall be the total number of particles in the system.
    * `min_age' and `max_age' define the allowed age range for particles, in
    *     seconds. No particle will survive beyond max_age, and every particle
    *     is guaranteed to remain alive for at least min_age seconds.
    * `min_theta' and `max_theta' define the range of directions in which new
    *     particles are allowed to be emitted.
    * `min_speed' and `max_speed' define the valid range of speeds for new
    *     particles.
    * `gravity' is a 2-vector representing a force affecting all particles at all
    *     times.
    */
  init() {
    /* Do some parameter validation */
    if (this.maxLifeRange < this.minLifeRange) {
      throw "Invalid min-max age range.";
    }
    if (this.maxTheta < this.minTheta
            || this.minTheta < -Math.PI
            || this.maxTheta > Math.PI) {
      throw "Invalid theta range.";
    }
    if (this.minSpeed > this.maxSpeed) {
      throw "Invalid min-max speed range.";
    }

    /* Create programs for updating and rendering the particle system. */
    var update_program = this.createGLProgram(
      vertexShaderUpdateSrc, fragmentShaderUpdateSrc, [
        "v_Position",
        "v_Age",
        "v_Life",
        "v_Velocity",
      ],
    );
    var render_program = this.createGLProgram(
      vertexShaderRenderSrc, fragmentShaderRenderSrc, null,
    );

    /* Capture attribute locations from program objects. */
    var update_attrib_locations = {
      i_Position: {
        location       : this.gl.getAttribLocation(update_program, "i_Position"),
        num_components : 2,
        type           : this.gl.FLOAT,
      },
      i_Age: {
        location       : this.gl.getAttribLocation(update_program, "i_Age"),
        num_components : 1,
        type           : this.gl.FLOAT,
      },
      i_Life: {
        location       : this.gl.getAttribLocation(update_program, "i_Life"),
        num_components : 1,
        type           : this.gl.FLOAT,
      },
      i_Velocity: {
        location       : this.gl.getAttribLocation(update_program, "i_Velocity"),
        num_components : 2,
        type           : this.gl.FLOAT,
      },
    };
    var render_attrib_locations = {
      i_Position: {
        location       : this.gl.getAttribLocation(render_program, "i_Position"),
        num_components : 2,
        type           : this.gl.FLOAT,
      },
    };

    /* These buffers shall contain data about particles. */
    var buffers = [
      this.gl.createBuffer(),
      this.gl.createBuffer(),
    ];
    /* We'll have 4 VAOs... */
    var vaos = [
      this.gl.createVertexArray(), /* for updating buffer 1 */
      this.gl.createVertexArray(), /* for updating buffer 2 */
      this.gl.createVertexArray(), /* for rendering buffer 1 */
      this.gl.createVertexArray(), /* for rendering buffer 2 */
    ];
    /* this has information about buffers and bindings for each VAO. */
    var vao_desc = [
      {
        vao     : vaos[0],
        buffers : [{
          buffer_object : buffers[0],
          stride        : 4 * 6,
          attribs       : update_attrib_locations,
        }],
      },
      {
        vao     : vaos[1],
        buffers : [{
          buffer_object : buffers[1],
          stride        : 4 * 6,
          attribs       : update_attrib_locations,
        }],
      },
      {
        vao     : vaos[2],
        buffers : [{
          buffer_object : buffers[0],
          stride        : 4 * 6,
          attribs       : render_attrib_locations,
        }],
      },
      {
        vao     : vaos[3],
        buffers : [{
          buffer_object : buffers[1],
          stride        : 4 * 6,
          attribs       : render_attrib_locations,
        }],
      },
    ];


    /* Populate buffers with some initial data. */
    var initial_data
            = new Float32Array(this.initialParticleData());
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers[0]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, initial_data, this.gl.STREAM_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers[1]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, initial_data, this.gl.STREAM_DRAW);

    /* Set up VAOs */
    for (var i = 0; i < vao_desc.length; i++) {
      this.setupParticleBufferVAO(vao_desc[i].buffers, vao_desc[i].vao);
    }

    /* Create a texture for random values. */
    var rg_noise_texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, rg_noise_texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D,
      0,
      this.gl.RG8,
      512,
      512,
      0,
      this.gl.RG,
      this.gl.UNSIGNED_BYTE,
      this.randomRGData(512, 512));
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.MIRRORED_REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.MIRRORED_REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    return {
      particle_sys_buffers    : buffers,
      particle_sys_vaos       : vaos,
      read                    : 0,
      write                   : 1,
      particle_update_program : update_program,
      particle_render_program : render_program,
      num_particles           : initial_data.length / 6,
      old_timestamp           : 0.0,
      rg_noise                : rg_noise_texture,
      total_time              : 0.0,
      born_particles          : 0,
      birth_rate              : this.birthRate,
      gravity                 : this.gravity,
      origin                  : [0.0, 0.0],
      min_theta               : this.minTheta,
      max_theta               : this.maxTheta,
      min_speed               : this.minSpeed,
      max_speed               : this.maxSpeed,
    };
  }

  /* Gets called every frame.
    `gl' shall be a valid WebGL 2 context
    `state' is shall be the state of the particle system
    `timestamp_millis' is the current timestamp in milliseconds
    */
  renderParticle(time_delta) {
    var num_part = this.state.born_particles;
    /* Here's where birth rate parameter comes into play.
            We add to the number of active particles in the system
            based on birth rate and elapsed time. */
    if (this.state.born_particles < this.state.num_particles) {
      this.state.born_particles = Math.min(this.state.num_particles,
        Math.floor(this.state.born_particles + this.state.birth_rate * time_delta));
    }
    /* Set the previous update timestamp for calculating time delta in the
            next frame. */

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.useProgram(this.state.particle_update_program);

    /* Most of the following is trivial setting of uniforms */
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_TimeDelta"),
      time_delta / 1000.0,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_TotalTime"),
      this.state.total_time,
    );
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_Gravity"),
      this.state.gravity[0],
      this.state.gravity[1],
    );
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_Origin"),
      this.state.origin[0],
      this.state.origin[1],
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_MinTheta"),
      this.state.min_theta,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_MaxTheta"),
      this.state.max_theta,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_MinSpeed"),
      this.state.min_speed,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_MaxSpeed"),
      this.state.max_speed,
    );
    this.state.total_time += time_delta;
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.state.rg_noise);
    this.gl.uniform1i(
      this.gl.getUniformLocation(this.state.particle_update_program, "u_RgNoise"),
      0,
    );

    /* Bind the "read" buffer - it contains the this.state of the particle system
            "as of now".*/
    this.gl.bindVertexArray(this.state.particle_sys_vaos[this.state.read]);

    /* Bind the "write" buffer as transform feedback - the varyings of the
            update shader will be written here. */
    this.gl.bindBufferBase(
      this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.state.particle_sys_buffers[this.state.write],
    );

    /* Since we're not actually rendering anything when updating the particle
            state, disable rasterization.*/
    this.gl.enable(this.gl.RASTERIZER_DISCARD);

    /* Begin transform feedback! */
    this.gl.beginTransformFeedback(this.gl.POINTS);
    this.gl.drawArrays(this.gl.POINTS, 0, num_part);
    this.gl.endTransformFeedback();
    this.gl.disable(this.gl.RASTERIZER_DISCARD);
    /* Don't forget to unbind the transform feedback buffer! */
    this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

    /* Now, we draw the particle system. Note that we're actually
            drawing the data from the "read" buffer, not the "write" buffer
            that we've written the updated data to. */
    this.gl.bindVertexArray(this.state.particle_sys_vaos[this.state.read + 2]);
    this.gl.useProgram(this.state.particle_render_program);
    this.gl.drawArrays(this.gl.POINTS, 0, num_part);

    /* Finally, we swap read and write buffers. The updated this.state will be
            rendered on the next frame. */
    var tmp = this.state.read;
    this.state.read = this.state.write;
    this.state.write = tmp;

    /* This just loops this function. */
  }
}
