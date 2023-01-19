import { RawShaderMaterial } from 'three'

import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class BasicMaterial extends RawShaderMaterial {
	constructor() {
		super({
			vertexShader,
			fragmentShader
		})
	}
}