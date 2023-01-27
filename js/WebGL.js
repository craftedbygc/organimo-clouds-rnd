import { ClampToEdgeWrapping, Clock, Color, Fog, LinearFilter, PerspectiveCamera, LinearMipmapLinearFilter, Texture, WebGLRenderer } from 'three'
import store from './store'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { E, qs } from './utils'
import GlobalEvents from './utils/GlobalEvents'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass.js'
export default class WebGL {
	constructor() {
		this.dom = {
			canvas: qs('canvas')
		}

		this.setup()

		E.on('App:start', this.start)
	}

	setup() {
		this.renderer = new WebGLRenderer({ alpha: true, alphaTest: 0.9, antialias: true, canvas: this.dom.canvas, powerPreference: 'high-performance', stencil: false })
		this.renderer.setPixelRatio(store.window.dpr >= 2 ? 2 : store.window.dpr)
		this.renderer.setSize(store.window.w, store.window.h)
		this.renderer.setClearColor(0xFF0000, 0)
		this.renderer.autoClear = false
		store.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 0.1, 5000)
		store.camera.position.z = 15
		store.camera.position.y = 3

		this.background = new Color(0xFF0000)
		this.fog = new Fog(0x000000, store.camera.near, store.camera.far)

		this.controls = new OrbitControls(store.camera, this.renderer.domElement)
		this.controls.enableDamping = true

		this.clock = new Clock()

		this.globalUniforms = {
			uDelta: { value: 0 },
			uTime: { value: 0 }
		}

		this.composer = new EffectComposer(this.renderer)

		// setTimeout(() => {
		// 	this.CloudRender = new RenderPass(store.CloudScene, store.camera)
		// 	this.MoutainRender = new RenderPass(store.EnvMapTest, store.camera)
		// 	this.maskPass = new MaskPass(store.EnvMapTest, store.camera)
		// 	this.composer.addPass(this.CloudRender)
		// 	this.composer.addPass(this.MoutainRender)
		// }, 5000)
	}

	start = () => {
		this.addEvents()
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 0)
	}

	onRaf = (time) => {
		this.controls.update()
		this.clockDelta = this.clock.getDelta()
		this.globalUniforms.uDelta.value = this.clockDelta > 0.016 ? 0.016 : this.clockDelta
		this.globalUniforms.uTime.value = time

		this.renderer.render(store.EnvMapTest, store.camera)
		// this.renderer.render(store.EnvMapTest, store.camera)
		// this.renderer.clear(true, false, false)
		// this.renderer.render(store.CloudScene, store.camera)
		// this.composer.render()
	}

	onResize = () => {
		this.renderer.setSize(store.window.w, store.window.h)
	}

	generateTexture(texture, options = {}, isKtx = false) {
		if (texture instanceof HTMLImageElement) {
			texture = new Texture(texture)
		}
		texture.minFilter = options.minFilter || (isKtx ? LinearFilter : LinearMipmapLinearFilter)
		texture.magFilter = options.magFilter || LinearFilter
		texture.wrapS = texture.wrapT = options.wrapping || ClampToEdgeWrapping
		this.renderer.initTexture(texture)
		return texture
	}
}