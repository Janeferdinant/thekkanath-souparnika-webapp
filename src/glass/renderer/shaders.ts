export const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

/**
 * The photo is drawn exactly as the DOM <img> shows it (object-fit: cover), so outside the lenses
 * the canvas is pixel-identical to the photo underneath. Inside a lens the photo bends toward the
 * rim only: the middle of every lens is undistorted, so text above it stays crisp and legible.
 * Chromatic dispersion is limited to that rim band.
 */
export const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D u_img;
uniform vec2 u_res;        // canvas size in device px
uniform vec2 u_imgSize;    // photo size in px
uniform vec2 u_light;      // light position in device px, bottom-left origin
uniform float u_dpr;
uniform float u_count;     // number of active lenses (at most 4)
uniform vec4 u_rect[4];    // x, y, w, h in device px, bottom-left origin
uniform float u_radius[4]; // corner radius in device px

// photo colour at a canvas pixel, using the same mapping as object-fit: cover
vec3 photoAt(vec2 p) {
  float s = max(u_res.x / u_imgSize.x, u_res.y / u_imgSize.y);
  vec2 shown = u_imgSize * s;
  return texture2D(u_img, (p - 0.5 * u_res) / shown + 0.5).rgb;
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec3 base = photoAt(p);
  vec3 col = base;
  float bezel = 18.0 * u_dpr;

  for (int i = 0; i < 4; i++) {
    if (float(i) >= u_count) break;

    vec4 r = u_rect[i];
    vec2 hs = r.zw * 0.5;
    vec2 c = r.xy + hs;
    float rad = min(u_radius[i], min(hs.x, hs.y));
    vec2 q = abs(p - c) - hs + rad;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rad; // < 0 inside

    if (d < 0.0) {
      vec2 sgn = sign(p - c);
      vec2 m = max(q, 0.0);
      vec2 n = length(m) > 0.0 ? normalize(m) * sgn : (q.x > q.y ? vec2(sgn.x, 0.0) : vec2(0.0, sgn.y));

      float t = clamp(-d / bezel, 0.0, 1.0);     // 0 at the edge, 1 past the bezel
      float bend = (1.0 - t) * (1.0 - t);        // strongest at the rim
      vec2 off = -n * bend * 14.0 * u_dpr;

      vec3 lens = vec3(photoAt(p + off).r, photoAt(p + off * 1.04).g, photoAt(p + off * 1.08).b);

      float fres = pow(1.0 - t, 3.0);            // Fresnel-like rim
      vec2 toLight = u_light - p;
      float lightLen = max(length(toLight), 0.0001);
      float spec = pow(max(dot(n, toLight / lightLen), 0.0), 8.0) * fres;
      lens = mix(lens, lens * 0.88, (1.0 - t) * 0.5) + vec3(1.0, 0.95, 0.86) * (0.22 * fres + 0.35 * spec);

      col = mix(base, lens, smoothstep(0.0, 1.5 * u_dpr, -d)); // soft outer edge
      break;
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
`;
