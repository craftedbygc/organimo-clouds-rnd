import { Color, Fog, Mesh, Object3D, PerspectiveCamera, Scene, PlaneGeometry, MeshBasicMaterial, InstancedMesh, Vector3, Euler, Quaternion, Matrix4 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BasicMaterial, CloudsMaterial } from '../materials'
import store from '../store'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'

export default class MainScene extends Scene {
	constructor() {
		super()

		this.particles = []
		this.dummy = new Object3D()
		this.count = 200
		this.spread = 10
		this.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 0.1, 50)
		this.camera.position.z = 10

		this.background = new Color(0x000000)
		this.fog = new Fog(0x000000, this.camera.near, this.camera.far)

		this.controls = new OrbitControls(this.camera, store.WebGL.renderer.domElement)
		this.controls.enableDamping = true
		console.log(store)
		this.load()

		E.on('App:start', () => {
			this.build()
			this.addEvents()
		})
	}

	build() {
		this.particle = this.buildParticle()
		for (let i = 0; i < this.count; i++) {
			this.particles.push(this.particleData(Math.random() * 3 - 1.5, Math.random() * 1 - 0.5))
		}
		this.createInstance()
	}

	createInstance() {
		const matrix = new Matrix4()
		this.instanceMesh = new InstancedMesh(this.particleGeometry, this.particleMaterial, this.count)
		this.particles.forEach((el, i) => {
			const position = new Vector3()
			const rotation = new Euler()
			const quaternion = new Quaternion()
			const scale = new Vector3()

			position.x = el.x
			position.y = el.y
			position.z = 0

			rotation.x = 0
			rotation.y = el.rotationZ
			rotation.z = el.rotationZ
			quaternion.setFromEuler(rotation)

			scale.x = scale.y = scale.z = 1
			// this.posArray.push(position)
			matrix.compose(position, quaternion, scale)
			this.instanceMesh.setMatrixAt(i, matrix)
		})
		this.add(this.instanceMesh)
	}

	buildParticle() {
		this.particleGeometry = new PlaneGeometry(1, 1)
		this.particleMaterial = new CloudsMaterial({
			color: 0xffffff,
			alphaMap: this.assets.textures.smoke,
			depthTest: false,
			opacity: 1,
			transparent: true
		})
		this.particle = new Mesh(this.particleGeometry, this.particleMaterial)
		this.particle.scale.z = 3
		// this.add(this.particle)
	}

	particleData(x, y) {
		const particle = {}
		particle.x = x + .15 * (Math.random() - .5)
		particle.y = y + .15 * (Math.random() - .5)
		particle.z = (Math.random() - .5)

		particle.isGrowing = true
		particle.toDelete = false

		particle.maxScale = .1 + 1.5 * Math.pow(Math.random(), 10)
		particle.scale = Math.random() * particle.maxScale

		particle.deltaScale = .03 + .03 * Math.random()
		particle.age = Math.PI * Math.random()
		particle.ageDelta = .001 + .002 * Math.random()
		particle.rotationZ = .5 * Math.random() * Math.PI
		particle.deltaRotation = .01	 * (Math.random() * 0.1 - .05)

		return particle
	}

	grow(el) {
		el.age += el.ageDelta
		el.rotationZ += el.deltaRotation
		el.scale = el.maxScale * 2 + .1 * Math.sin(el.age)
	}

	randomizeMatrix(i, matrix, x, y, z) {
		const position = new Vector3()
		const rotation = new Euler()
		const quaternion = new Quaternion()
		const scale = new Vector3()

		position.x = x
		position.y = y
		position.z = 0

		rotation.x = 0
		rotation.y = 0
		rotation.z = 0

		quaternion.setFromEuler(rotation)

		scale.x = scale.y = scale.z = 0.2
		// this.posArray.push(position)
		matrix.compose(position, quaternion, scale)
		return matrix
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 3)
	}

	onRaf = () => {
		this.updadeInstanceMatrix()
		this.controls.update()
		store.WebGL.renderer.render(this, this.camera)
	}

	updadeInstanceMatrix() {
		this.particles.forEach((p, i) => {
			this.grow(p)
			this.dummy.quaternion.copy(this.camera.quaternion)
			this.dummy.rotation.z += p.rotationZ
			this.dummy.scale.set(p.scale, p.scale, p.scale)
			this.dummy.position.set(p.x, p.y, p.z)
			this.dummy.updateMatrix()
			this.instanceMesh.setMatrixAt(i, this.dummy.matrix)
			// idx++
		})
		this.instanceMesh.instanceMatrix.needsUpdate = true
	}

	onResize = () => {
		this.camera.aspect = store.window.w / store.window.h
		this.camera.updateProjectionMatrix()
	}

	load() {
		this.assets = {
			textures: {
			},
			models: {}
		}
		const textures = {
			smoke: 'smoke.png'
		}
		for (const key in textures) {
			store.AssetLoader.loadTexture((`texture/${textures[key]}`)).then(texture => {
				this.assets.textures[key] = texture
			})
		}
	}
}