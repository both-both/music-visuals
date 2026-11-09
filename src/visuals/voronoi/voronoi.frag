#ifdef GL_ES
precision mediump float;
#endif

#define GRADIENT_STEPS 10.0
#define TYPES 3
#define MAX_POINTS 10

uniform vec2 u_resolution;
uniform float u_points[MAX_POINTS * TYPES * 2];
uniform float u_colors[TYPES * 3];
uniform float u_size;
float minDist[TYPES];

void main() {
  vec2 pixelPosition = gl_FragCoord.xy - u_resolution.xy * 0.5;
  vec3 color = vec3(0);

  for (int j = 0; j < TYPES; j++) {
    minDist[j] = length(u_resolution.xy);
    for (int i = 0; i < MAX_POINTS; i++) {
      vec2 point = vec2(u_points[2 * j * MAX_POINTS + i * 2], u_points[2 * j * MAX_POINTS + i * 2 + 1]);
      vec2 distVec = (point - pixelPosition) / (u_resolution.yy * u_size);
      minDist[j] = min(minDist[j], length(distVec));
    }
    color += vec3(u_colors[j * 3], u_colors[j * 3 + 1], u_colors[j * 3 + 2]) * (1.0 - minDist[j] * minDist[j]);
  }

  gl_FragColor = vec4(ceil(color * GRADIENT_STEPS) / GRADIENT_STEPS, 1);
}
