#include <defaultFrag>

varying vec3 vNormal;
varying vec2 vUv;
uniform sampler2D alphaMap;
void main() {

	vec4 t = texture2D(alphaMap, vUv);
    gl_FragColor = vec4(1., 1., 1., t.r - 0.1);
}