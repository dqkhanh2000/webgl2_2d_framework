#version 300 es
precision mediump float;

uniform sampler2D u_Sprite;

in float v_Age;
in float v_Life;
in vec2 v_TexCoord;

out vec4 o_FragColor;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    float t =  v_Age/v_Life;
    vec4 color = vec4(vec3(1.0, 0.6, 0.9), 1.0-(v_Age/v_Life));
    o_FragColor = color * texture(u_Sprite, v_TexCoord);
}