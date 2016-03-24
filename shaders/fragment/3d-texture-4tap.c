precision mediump float;

//passed in from the vertex shader
varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texturecoordinate;
varying vec2 v_texturesize;
varying vec2 v_textureoffset;

//the texture
uniform sampler2D u_texture;

vec4 fourTapSample(vec2 tileOffset, //Tile offset in the atlas 
                  vec2 tileUV, //Tile coordinate (as above)
                  float tileSize, //Size of a tile in atlas
                  sampler2D atlas) {
  //Initialize accumulators
  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  float totalWeight = 0.0;

  for(int dx=0; dx<2; ++dx) {
    for(int dy=0; dy<2; ++dy) {
      //Compute coordinate in 2x2 tile patch
      vec2 tileCoord = 2.0 * fract(0.5 * (tileUV + vec2(dx, dy)));
  
      //Weight sample based on distance to center
      float w = pow(1.0 - max(abs(tileCoord.x-1.0), abs(tileCoord.y-1.0)), 16.0);
  
      //Compute atlas coord
      vec2 atlasUV = tileOffset + tileSize * tileCoord;
  
      //Sample and accumulate
      color += w * texture2D(atlas, atlasUV);
      totalWeight += w;
    }
  }
  
  //Return weighted color
  return color / totalWeight;
}

void main() {
  vec3 scaled_position = v_position.xyz / 16.0;
  vec2 tileUV = vec2(dot(v_normal.zxy, scaled_position), dot(v_normal.yzx, scaled_position));
  vec2 blah = v_textureoffset + v_texturesize * fract(tileUV);
  // vec2 grr = v_texturecoordinate;

  vec4 fourtapcolor = fourTapSample(v_textureoffset, tileUV, 1.0 / 16.0, u_texture);

  gl_FragColor = fourtapcolor;//texture2D(u_texture, blah);
}