precision mediump float;

//passed in from the vertex shader
varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texturecoordinate;
varying vec2 v_texturesize;
varying vec2 v_textureoffset;

//the texture
uniform sampler2D u_texture;

void main() {
  vec3 scaled_position = v_position.xyz / 32.0;
  vec2 tileUV = vec2(dot(v_normal.zxy, scaled_position), dot(v_normal.yzx, scaled_position));
  vec2 blah = v_textureoffset +  v_texturesize * fract(tileUV);
  // vec2 grr = v_texturecoordinate;

  gl_FragColor = texture2D(u_texture, blah);
}