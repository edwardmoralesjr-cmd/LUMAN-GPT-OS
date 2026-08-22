// Shared GLSL noise + palette utilities, and the two fragment shaders used
// on the site: the hero incense-haze field, and the audio-reactive field
// on the Sound page.

const NOISE_LIB = `
  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash3(i).x;
    float b = hash3(i + vec2(1.0, 0.0)).x;
    float c = hash3(i + vec2(0.0, 1.0)).x;
    float d = hash3(i + vec2(1.0, 1.0)).x;
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.55;
    for (int i = 0; i < 5; i++) {
      value += amp * noise(p);
      p *= 2.02;
      amp *= 0.55;
    }
    return value;
  }
`;

export const HERO_FRAGMENT_SRC = `#version 300 es
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse; // normalized -1..1, smoothed
  uniform float u_reduced;
  out vec4 fragColor;

  ${NOISE_LIB}

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

    float t = u_time * 0.045 * (1.0 - u_reduced * 0.85);

    // Mouse gently warps the haze field, never snaps.
    vec2 warp = u_mouse * 0.12 * (1.0 - u_reduced);
    vec2 q = p * 1.6 + warp;

    float haze = fbm(q + vec2(t, -t * 0.6));
    float haze2 = fbm(q * 2.1 - vec2(t * 0.7, t));
    float field = mix(haze, haze2, 0.45);

    // Slow crimson bloom pulsing from lower-center, like sanctuary light.
    float bloomDist = length(p - vec2(0.0, 0.32));
    float pulse = 0.5 + 0.5 * sin(u_time * 0.35 * (1.0 - u_reduced * 0.9));
    float bloom = smoothstep(0.9, 0.0, bloomDist) * (0.35 + 0.25 * pulse);

    vec3 base = vec3(0.027, 0.031, 0.039); // near-black ink
    vec3 crimson = vec3(0.612, 0.102, 0.173);
    vec3 bone = vec3(0.929, 0.902, 0.847);

    vec3 color = base;
    color += crimson * bloom;
    color += bone * field * 0.05;
    color += crimson * pow(field, 3.0) * 0.12;

    float vignette = smoothstep(1.05, 0.25, length(p));
    color *= mix(0.65, 1.0, vignette);

    fragColor = vec4(color, 1.0);
  }
`;

export const REACTIVE_FRAGMENT_SRC = `#version 300 es
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_level; // 0..1 audio amplitude
  uniform float u_reduced;
  out vec4 fragColor;

  ${NOISE_LIB}

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

    float t = u_time * 0.08 * (1.0 - u_reduced * 0.85);
    float level = u_level * (1.0 - u_reduced * 0.6);

    vec2 q = p * (1.4 + level * 1.6);
    float field = fbm(q + vec2(t, -t * 0.5) + level * 1.5);

    // Sub-bass hits push a sharp radial displacement outward.
    float dist = length(p);
    float kick = smoothstep(0.0, 1.0, level) * 0.4;
    float ring = smoothstep(kick, kick + 0.05, dist) - smoothstep(kick + 0.05, kick + 0.3, dist);

    vec3 base = vec3(0.027, 0.031, 0.039);
    vec3 crimson = vec3(0.761, 0.165, 0.247);
    vec3 gold = vec3(0.694, 0.537, 0.243);

    vec3 color = base;
    color += crimson * field * (0.25 + level * 0.5);
    color += gold * ring * 0.5;
    color += crimson * pow(max(field, 0.0), 4.0) * level;

    float vignette = smoothstep(1.1, 0.2, dist);
    color *= mix(0.6, 1.0, vignette);

    fragColor = vec4(color, 1.0);
  }
`;
