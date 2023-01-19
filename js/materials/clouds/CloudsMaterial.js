import { RawShaderMaterial, DoubleSide } from 'three'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class Clouds extends RawShaderMaterial {
	constructor(options) {
		super({
			vertexShader,
			fragmentShader,
			// depthWrite: true,
			depthTest: false,
			transparent: true,
			side: DoubleSide,
			uniforms: {
				color: options.color,
				alphaMap: { value: options.alphaMap },
				uCameraRotation: { value: 0 }
			}
		})
	}
}