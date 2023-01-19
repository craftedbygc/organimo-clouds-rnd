import { Pane } from 'tweakpane'
import store from '../store'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

export class Gui extends Pane {
	constructor() {
		super({
			title: 'Options'
		})

		this.containerElem_.style.width = '350px'

		this.registerPlugin(EssentialsPlugin)

		this.options = {}

		this.initTorus()

		this.fps = this.addBlade({
			view: 'fpsgraph'
		})
	}

	initTorus() {
		this.options.torus = {
			position: store.MainScene.torus.position
		}
		this.addInput(this.options.torus, 'position')
	}
}