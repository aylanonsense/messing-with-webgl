precision mediump float;

//passed in from the vertex shader
varying vec3 v_normal;
varying vec2 v_texcoord;

//the texture
uniform sampler2D u_texture;

void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord);
}