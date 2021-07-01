import { GUI } from 'dat.gui';

class UIController {
	constructor( currentFilm ) {
		this.gui = new GUI();
		this.gui.width = 270;
		this.gui.domElement.style.visibility = 'visible';
		this.film = currentFilm;

		return this;
	}

	init() {
		this.guiSettings();
		this.guiAddWorldFolder( this.film.cores.physic, this.film.cores.graphic );
		this.guiAddSceneFolder( this.film.cores.graphic.currentScene );
		this.guiAddVehicleFolder( this.film.cores.graphic.currentScene );
	}

	guiSettings() {
		this.gui.domElement.style.transform = 'scale(1)';
		if ( this.film.cores.graphic.domElement ) {
			this.film.cores.graphic.domElement.appendChild( this.gui.domElement );
		} else {
			document.body.appendChild( this.gui.domElement );
		}

		this.gui.domElement.style.position = 'absolute';
		this.gui.domElement.style.right = '0';
		this.gui.domElement.style.top = '0';
	}

	guiAddWorldFolder( physic, graphic ) {
		const params = {
			pausePhysic: false,
			stopAnimation: false,
			gravity: {
				gx: physic.world.gravity.x,
				gy: physic.world.gravity.y,
				gz: physic.world.gravity.z
			},
			fps: graphic.appConfig.fps,
			worldFrequency: physic.worldFrequency
		};
		const world = this.gui.addFolder( 'World' );
		world.add( params, 'pausePhysic' )
			.onChange( ( cmd ) => {
				if ( cmd ) {
					this.film.cores.physic.stop();
				} else {
					this.film.cores.physic.run();
				}
				// ( cmd ) ? this.film.cores.physic.stop() : this.film.cores.physic.run();
			} );
		world.add( params, 'stopAnimation' )
			.onChange( ( cmd ) => {
				if ( cmd ) {
					this.film.stop();
				} else {
					this.film.run();
				}
			} );
		// world.add(params,'fps',20,160,1)
		// .onChange((fps)=>{
		//     graphic.appConfig.fps = fps;
		// });
		world.add( params, 'worldFrequency', 20, 160, 1 )
			.onChange( ( freq ) => {
				physic.setWorldFreq( freq );
			} );
		const gravity = world.addFolder( 'Gravity' );

		gravity.add( params.gravity, 'gx', -20, 20, 0.01 )
			.onChange( ( x ) => {
				physic.world.gravity.x = x;
			} );
		gravity.add( params.gravity, 'gy', -25, 20, 0.01 )
			.onChange( ( y ) => {
				physic.world.gravity.y = y;
			} );
		gravity.add( params.gravity, 'gz', -20, 20, 0.01 )
			.onChange( ( z ) => {
				physic.world.gravity.z = z;
			} );

	}

	guiAddSceneFolder( currentScene ) {

		const scene = this.gui.addFolder( 'Scene' );

		const params = {
			fog: false,
			shadow: false,
			background: currentScene.defBackground.getHex(),
			intensity: currentScene.sceneLight.intensity,
			color: currentScene.sceneLight.color.getHex(),
			height: currentScene.settings.sceneLightBias,
			cameraMaxDist: currentScene.settings.controlsMaxDist,
			cameraMaxAngle: currentScene.settings.controlsMaxAngle
		};

		scene.add( params, 'fog' )
			.onChange( ( v ) => {
				if ( v ) {
					currentScene.addFog();
					currentScene.gui.changeSceneBackground( params.background );
				} else {
					currentScene.removeFog();
				}
			} );

		scene.add( params, 'shadow' )
			.onChange( ( v ) => {
				this.film.cores.graphic.visuShadows( v );
			} );

		scene.addColor( params, 'background' )
			.onChange( ( color ) => {
				currentScene.gui.changeSceneBackground( color );
			} );

		scene.add( params, 'cameraMaxDist', 0, 20, 1 )
			.onChange( ( d ) => {
				currentScene.settings.controlsMaxDist = d;
				currentScene.changeControlMaxDist();
			} );
		scene.add( params, 'cameraMaxAngle', 0, Math.PI, 0.01 )
			.onChange( ( a ) => {
				currentScene.settings.controlsMaxAngle = a;
				currentScene.changeControlMaxAngle();
			} );

		const light = scene.addFolder( 'Light' );

		light.add( params, 'intensity', 0, 2, 0.1 )
			.onChange( ( intensity ) => {
				currentScene.gui.changeSceneLightIntensity( intensity );
			} );

		light.addColor( params, 'color' )
			.onChange( ( color ) => {
				currentScene.gui.changeSceneLightColor( color );
			} );

		light.add( params, 'height', -3, 20, 0.1 )
			.onChange( ( bias ) => {
				currentScene.gui.changeSceneLightPosition( bias );
			} );
	}

	guiAddVehicleFolder( currentScene ) {
		const params = {
			physicBody: false,
			compression: currentScene.vehicle.wheelOptions.dampingCompression,
			relaxation: currentScene.vehicle.wheelOptions.dampingRelaxation,
			clearence: 0,
			typeDrive: 'Full',
			headlights: {
				visible: false,
				intensity: 2,
				angle: 1.1,
				distance: 100,
				penumbra: 0.24,
				x: 100,
				z: -21
			},
			maxEngineForce: currentScene.vehicle.settings.maxEngineForce,
			maxBrakeForce: currentScene.vehicle.settings.maxBrakeForce,
			friction: currentScene.vehicle.wheelOptions.frictionSlip,
			body: {
				emissiveIntensity: currentScene.vehicle.materials.body.emissiveIntensity,
				envMapIntensity: currentScene.vehicle.materials.body.envMapIntensity,
				metalness: currentScene.vehicle.materials.body.metalness,
				roughness: currentScene.vehicle.materials.body.roughness,
				emissive: currentScene.vehicle.materials.body.emissive.getHex(),
				color: currentScene.vehicle.materials.body.color.getHex()
			},
			rim: {
				emissiveIntensity: currentScene.vehicle.materials.rim.LF.emissiveIntensity,
				envMapIntensity: currentScene.vehicle.materials.rim.LF.envMapIntensity,
				metalness: currentScene.vehicle.materials.rim.LF.metalness,
				roughness: currentScene.vehicle.materials.rim.LF.roughness,
				emissive: currentScene.vehicle.materials.rim.LF.emissive.getHex(),
				color: currentScene.vehicle.materials.rim.LF.color.getHex()
			},
			supp: { color: currentScene.vehicle.materials.supports.LF.color.getHex() }
		};
		const vehicle = this.gui.addFolder( 'Vehicle' );

		vehicle.add( params, 'physicBody' )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleBodyPhysicBodyVisu( v );
			} );

		vehicle.add( params, 'maxEngineForce', 0, 1000, 1 )
			.onChange( ( e ) => {
				currentScene.gui.changeVehicleMaxEngine( e );
			} );
		vehicle.add( params, 'maxBrakeForce', 10, 100, 1 )
			.onChange( ( b ) => {
				currentScene.gui.changeVehicleMaxBrake( b );
			} );
		vehicle.add( params, 'friction', 0, 20, 1 )
			.onChange( ( f ) => {
				currentScene.gui.changeVehicleFriction( f );
			} );

		vehicle.add( params, 'typeDrive', [
			'Front',
			'Rear',
			'Full'
		] )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleTypeDrive( v );
			} );

		const headlights = vehicle.addFolder( 'Headlights' );
		const susp = vehicle.addFolder( 'Suspecsion' );
		const materials = vehicle.addFolder( 'Materials' );
		const body = materials.addFolder( 'Body' );
		const rim = materials.addFolder( 'Rim' );
		const supports = materials.addFolder( 'Supports' );


		headlights.add( params.headlights, 'visible' )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleBodyHeadlightsVisu( v );
			} );
		headlights.add( params.headlights, 'intensity', 0, 2, 0.1 )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleHeadlightsIntensity( v );
			} );

		headlights.add( params.headlights, 'angle', 0, Math.PI / 2, 0.1 )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleHeadlightsAngle( v );
			} );

		headlights.add( params.headlights, 'distance', 0, 100, 1 )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleHeadlightsDistance( v );
			} );

		headlights.add( params.headlights, 'penumbra', 0, 1, 0.1 )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleHeadlightsPenumbra( v );
			} );

		headlights.add( params.headlights, 'x', 50, 200, 1 )
			.onChange( ( x ) => {
				currentScene.gui.changeVehicleHeadlightsTargetX( x );
			} );

		headlights.add( params.headlights, 'z', -50, 100, 1 )
			.onChange( ( z ) => {
				currentScene.gui.changeVehicleHeadlightsTargetZ( z );
			} );


		susp.add( params, 'compression', 0, 4, 0.1 )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleCompression( v );
			} );
		susp.add( params, 'relaxation', 0, 4, 0.1 )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleRelaxation( v );
			} );
		susp.add( params, 'clearence', -0.4, 0.4, 0.01 )
			.onChange( ( v ) => {
				currentScene.gui.changeVehicleClearence( v / 15 );
			} );

		body.add( params.body, 'emissiveIntensity', 0, 2, 0.1 )
			.onChange( ( ei ) => {
				currentScene.gui.changeVehicleMaterialBodyEI( ei );
			} );
		body.add( params.body, 'envMapIntensity', 0, 2, 0.1 )
			.onChange( ( envI ) => {
				currentScene.gui.changeVehicleMaterialBodyEnvI( envI );
			} );
		body.add( params.body, 'metalness', 0, 1, 0.1 )
			.onChange( ( m ) => {
				currentScene.gui.changeVehicleMaterialBodyMetalness( m );
			} );
		body.add( params.body, 'roughness', 0, 1, 0.1 )
			.onChange( ( r ) => {
				currentScene.gui.changeVehicleMaterialBodyRoughness( r );
			} );
		body.addColor( params.body, 'emissive' )
			.onChange( ( color ) => {
				currentScene.gui.changeVehicleMaterialBodyEmissiveColor( color );
			} );
		body.addColor( params.body, 'color' )
			.onChange( ( color ) => {
				currentScene.gui.changeVehicleMaterialBodyColor( color );
			} );

		rim.add( params.rim, 'emissiveIntensity', 0, 2, 0.1 )
			.onChange( ( ei ) => {
				currentScene.gui.changeVehicleMaterialRimEI( ei );
			} );
		rim.add( params.rim, 'envMapIntensity', 0, 2, 0.1 )
			.onChange( ( envI ) => {
				currentScene.gui.changeVehicleMaterialRimEnvI( envI );
			} );
		rim.add( params.rim, 'metalness', 0, 1, 0.1 )
			.onChange( ( m ) => {
				currentScene.gui.changeVehicleMaterialRimMetalness( m );
			} );
		rim.add( params.rim, 'roughness', 0, 1, 0.1 )
			.onChange( ( r ) => {
				currentScene.gui.changeVehicleMaterialRimRoughness( r );
			} );
		rim.addColor( params.rim, 'emissive' )
			.onChange( ( color ) => {
				currentScene.gui.changeVehicleMaterialRimEmissiveColor( color );
			} );
		rim.addColor( params.rim, 'color' )
			.onChange( ( color ) => {
				currentScene.gui.changeVehicleMaterialRimColor( color );
			} );

		supports.addColor( params.supp, 'color' )
			.onChange( ( color ) => {
				currentScene.gui.changeVehicleMaterialSuppColor( color );
			} );
	}

	changeVisibleGUI() {
		const v = this.gui.domElement.style.visibility;
		if ( v === 'visible' ) {
			this.gui.domElement.style.visibility = 'hidden';
			this.film.cores.graphic.chageStatusGuideMenu( 'hidden' );
		} else if ( v === 'hidden' ) {
			this.gui.domElement.style.visibility = 'visible';
			this.film.cores.graphic.chageStatusGuideMenu( 'visible' );
		}
	}
}

export { UIController };
