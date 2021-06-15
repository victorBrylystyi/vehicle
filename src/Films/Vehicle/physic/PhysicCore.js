import { Core } from '../../../cores/Core';
import * as CANNON from 'cannon';
import { VehicleWorld } from './worlds/VehicleWorld';

class PhysicCore extends Core {
	constructor() {
		super();
		this.worldFrequency = 60;
		this.isPaused = false;
		this.dT = 1 / this.worldFrequency;
		this.world = new CANNON.World();
		this.currentWorld = null;
		this.name = 'cannon.js app';
	}

	init() {
		this.currentWorld = new VehicleWorld( this.world );
		console.log( 'CANNON done init' );
	}

	preStart() {
		console.log( 'CANNON done prestart' );
		this.isPaused = false;
		this.currentWorld.isPaused = false;
		this.resetWorld();
		this.calculateDt();
		this.world.time = 0;
	}

	postStart() {
		this.resetWorld();
		this.isPaused = true;
		this.currentWorld.isPaused = true;
		this.dT = 0;
	}

	setWorldFreq( value ) {
		this.worldFrequency = value;
		this.calculateDt();
	}

	calculateDt() {
		this.dT = 1 / this.worldFrequency;
	}

	resetWorld() {
		this.world.clearForces();
	}

	run() {
		this.preStart();
	}

	stop() {
		this.postStart();
	}

	update() {
		if ( this.currentWorld ) {
			this.currentWorld.update();
		}

		this.world.step( this.dT );
	}
}

export { PhysicCore };
