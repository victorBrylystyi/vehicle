import { Core } from './Core';
import Stats from 'three/examples/jsm/libs/stats.module.js';

class Film extends Core {
	constructor() {
		super( 'cf' );
		this.cores = {
			graphic: null,
			physic: null
		};
		this.ui = null;
		this.stats = new Stats();
	}

	init() {
		if ( this.cores.physic ) {
			this.cores.physic.init();
		}
		if ( this.cores.graphic ) {
			this.cores.graphic.getPhysicWorld( this.cores.physic.currentWorld );
			this.cores.graphic.init();
		}
	}

	preStart() {
		if ( this.cores.physic ) {
			this.cores.physic.preStart();
		}
		if ( this.cores.graphic ) {
			this.cores.graphic.preStart();
		}

		console.log( 'done prestart' );
	}

	update() {

		this.stats.begin();

		if ( this.cores.physic ) {
			this.cores.physic.update();
		}
		if ( this.cores.graphic ) {
			this.cores.graphic.update();
		}

		this.stats.end();
	}

	postStart() {
		if ( this.cores.physic ) {
			this.cores.physic.postStart();
		}
		if ( this.cores.graphic ) {
			this.cores.graphic.postStart();
		}
	}
}

export { Film };
