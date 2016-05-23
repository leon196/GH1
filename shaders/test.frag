precision mediump float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform float uTime;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand (vec2 n)
{
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main (void)
{
	vec2 uv = vTextureCoord;
	float pixelCount = 256.;
	float pixelUnit = 1. / pixelCount;// + (sin(uTime * 0.1) * 0.5 + 0.5) * 0.01;
	// uv = floor(uv * pixelCount) / pixelCount;
	vec4 color = texture2D(uSampler, uv);
	vec2 center = uv - 0.5;
	float lum = (color.r + color.g + color.b) / 3.;
	float angle = lum * 3.1416 * 2.;

	// vec2 offset = vec2(cos(angle), sin(angle)) * pixelUnit;
	vec2 offset = vec2(0., -1.) * pixelUnit;
	// offset -= normalize(center) * pixelUnit;

	// uv = mod(abs(uv + offset), 1.0);
	color = texture2D(uSampler, uv);
	gl_FragColor = color;
}