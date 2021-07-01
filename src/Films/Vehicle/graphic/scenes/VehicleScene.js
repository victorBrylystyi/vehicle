/* eslint-disable prefer-reflect */
/* eslint-disable camelcase */
import * as THREE from 'three';
import { Ground } from '../../actors/Ground';
import { Vehicle } from '../../actors/Vehicle/Vehicle';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class VehicleScene {
	constructor( canvas, physicWorld, timer ) {
		this.name = 'vehicle scene';
		this.timer = timer;
		this.assetes = null;
		this.canvas = canvas;
		this.physicWorld = physicWorld;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000 );
		this.settings = {
			sceneLightBias: 0,
			controlsMaxDist: 2.5,
			controlsMaxAngle: 1.66
		};
		this.defBackground = new THREE.Color( 0xeeeeee );
		this.guide = null;
		this.init();

		return this;
	}

	init() {
		this.camera.position.x = 82.98;
		this.camera.position.y = 1.387;
		this.camera.position.z = -9.621;

		this.controls = new OrbitControls( this.camera, this.canvas );
		this.controls.dampingFactor = 0.05;
		this.controls.screenSpacePanning = false;

		this.controls.minDistance = 1.7;
		this.controls.maxDistance = this.settings.controlsMaxDist;

		this.controls.maxPolarAngle = this.settings.controlsMaxAngle;

		this.scene.background = this.defBackground;

		const near = 0.5;
		const far = 15;
		this.fog = new THREE.Fog( this.scene.background, near, far );

		this.vehicle = new Vehicle( this.physicWorld, this.timer );

		this.field = new Map();
		this.addSceneLight();

		const ground = new Ground( this.physicWorld, {
			sizeX: 20,
			sizeY: 20,
			heightPlane: 2,
			amplitude: 2,
			elementSize: 30
		}, new THREE.Vector3( -250, 0, 250 ) );

		// const ground2 = new Ground( this.physicWorld, {
		// 	sizeX: 100,
		// 	sizeY: 100,
		// 	heightPlane: 10,
		// 	amplitude: 3,
		// 	elementSize: 5
		// }, new THREE.Vector3( -745, 0, 250 ) );

		// const ground3 = new Ground( this.physicWorld, {
		// 	sizeX: 100,
		// 	sizeY: 100,
		// 	heightPlane: 10,
		// 	amplitude: 1,
		// 	elementSize: 5
		// }, new THREE.Vector3( 245, 0, 250 ) );

		// const ground4 = new Ground( this.physicWorld, {
		// 	sizeX: 100,
		// 	sizeY: 100,
		// 	heightPlane: 10,
		// 	amplitude: 0.1,
		// 	elementSize: 5
		// }, new THREE.Vector3( 245, 0, 745 ) );

		// const ground5 = new Ground( this.physicWorld, {
		// 	sizeX: 100,
		// 	sizeY: 100,
		// 	heightPlane: 10,
		// 	amplitude: 2,
		// 	elementSize: 5
		// }, new THREE.Vector3( 245, 0, -245 ) );

		// const ground6 = new Ground( this.physicWorld, {
		// 	sizeX: 100,
		// 	sizeY: 100,
		// 	heightPlane: 10,
		// 	amplitude: 3,
		// 	elementSize: 5
		// }, new THREE.Vector3( -250, 0, -245 ) );

		// const ground7 = new Ground( this.physicWorld, {
		// 	sizeX: 100,
		// 	sizeY: 100,
		// 	heightPlane: 10,
		// 	amplitude: 1,
		// 	elementSize: 5
		// }, new THREE.Vector3( -250, 0, 745 ) );

		// const ground8 = new Ground( this.physicWorld, {
		// 	sizeX: 100,
		// 	sizeY: 100,
		// 	heightPlane: 10,
		// 	amplitude: 2,
		// 	elementSize: 5
		// }, new THREE.Vector3( -745, 0, 745 ) );

		// const ground9 = new Ground( this.physicWorld, {
		// 	sizeX: 100,
		// 	sizeY: 100,
		// 	heightPlane: 10,
		// 	amplitude: 5,
		// 	elementSize: 5
		// }, new THREE.Vector3( -745, 0, -245 ) );

		this.field.set( 'ground1', ground );
		// this.field.set( 'ground2', ground2 );
		// this.field.set( 'ground3', ground3 );
		// this.field.set( 'ground4', ground4 );
		// this.field.set( 'ground5', ground5 );
		// this.field.set( 'ground6', ground6 );
		// this.field.set( 'ground7', ground7 );
		// this.field.set( 'ground8', ground8 );
		// this.field.set( 'ground9', ground9 );

		this.gui = {
			changeSceneBackground: ( colorHex ) => {
				if ( this.scene.background.isColor ) {
					this.scene.background.setHex( colorHex );
					if ( this.scene.fog ) {
						this.scene.fog.color.setHex( colorHex );
					}
				}

			},
			changeSceneLightIntensity: ( v ) => {
				this.sceneLight.intensity = v;
			},
			changeSceneLightColor: ( colorHex ) => {
				this.sceneLight.color.setHex( colorHex );
			},
			changeSceneLightPosition: ( position ) => {
				this.settings.sceneLightBias = position;
			},
			changeVehicleClearence: ( c ) => {
				this.vehicle.changeClearense( c );
			},
			changeVehicleCompression: ( cmp ) => {
				this.vehicle.changeCompression( cmp );
			},
			changeVehicleRelaxation: ( rlx ) => {
				this.vehicle.changeRelaxation( rlx );
			},
			changeVehicleHeadlightsDistance: ( d ) => {
				this.vehicle.changeHeadlightsDistance( d );
			},
			changeVehicleHeadlightsTargetZ: ( z ) => {
				this.vehicle.changeHeadlightsTargetZ( z );
			},
			changeVehicleHeadlightsTargetX: ( x ) => {
				this.vehicle.changeHeadlightsTargetX( x );
			},
			changeVehicleHeadlightsAngle: ( a ) => {
				this.vehicle.changeHeadlightsAngle( a );
			},
			changeVehicleHeadlightsIntensity: ( i ) => {
				this.vehicle.changeHeadlightsIntensity( i );
			},
			changeVehicleHeadlightsPenumbra: ( p ) => {
				this.vehicle.changeHeadlightsPenumbra( p );
			},

			changeVehicleMaterialBodyEI: ( i ) => {
				this.vehicle.changeMaterialBodyEI( i );
			},
			changeVehicleMaterialBodyEnvI: ( i ) => {
				this.vehicle.changeMaterialBodyEnvI( i );
			},
			changeVehicleMaterialBodyMetalness: ( m ) => {
				this.vehicle.changeMaterialBodyMetalness( m );
			},
			changeVehicleMaterialBodyRoughness: ( r ) => {
				this.vehicle.changeMaterialBodyRoughness( r );
			},
			changeVehicleMaterialBodyEmissiveColor: ( color ) => {
				this.vehicle.changeMaterialBodyEmissiveColor( color );
			},
			changeVehicleMaterialBodyColor: ( color ) => {
				this.vehicle.changeMaterialBodyColor( color );
			},

			changeVehicleMaterialRimEI: ( i ) => {
				this.vehicle.changeMaterialRimEI( i );
			},
			changeVehicleMaterialRimEnvI: ( i ) => {
				this.vehicle.changeMaterialRimEnvI( i );
			},
			changeVehicleMaterialRimMetalness: ( m ) => {
				this.vehicle.changeMaterialRimMetalness( m );
			},
			changeVehicleMaterialRimRoughness: ( r ) => {
				this.vehicle.changeMaterialRimRoughness( r );
			},
			changeVehicleMaterialRimEmissiveColor: ( color ) => {
				this.vehicle.changeMaterialRimEmissiveColor( color );
			},
			changeVehicleMaterialRimColor: ( color ) => {
				this.vehicle.changeMaterialRimColor( color );
			},

			changeVehicleFriction: ( f ) => {
				this.vehicle.changeFrictionSlip( f );
			},
			changeVehicleMaxEngine: ( e ) => {
				this.vehicle.changeMaxEngineForce( e );
			},
			changeVehicleMaxBrake: ( b ) => {
				this.vehicle.changeMaxBrakeForce( b );
			},
			changeVehicleBodyHeadlightsVisu: ( v ) => {
				this.vehicle.changeBodyHeadlightsVisible( v );
			},
			changeVehicleTypeDrive: ( type ) => {
				this.vehicle.changeTypeDrive( type );
			},

			changeVehicleMaterialSuppColor: ( color ) => {
				this.vehicle.changeMaterialSuppColor( color );
			},

			changeVehicleBodyPhysicBodyVisu: ( status ) => {
				this.vehicle.changeVisuPhysicMesh( status );
			}

		};

		this.field.forEach( ( ground ) => {
			// ground.receiveShadow = true;
			this.scene.add( ground );
		} );

		this.scene.add( this.vehicle.body );
		this.scene.add( this.vehicle.wheels.LF );
		this.scene.add( this.vehicle.wheels.LR );
		this.scene.add( this.vehicle.wheels.RF );
		this.scene.add( this.vehicle.wheels.RR );
	}

	addGuideText( guide ) {
		this.guide = guide;
		this.vehicle.guide = this.guide;
	}

	addAssets( data ) {
		const foundMeshByName = ( name = '', source ) => {
			for ( let i = 0; i < source.length; i++ ) {
				if ( source[ i ].name === name ) {
					return source[ i ];
				}
			}
		};

		const foundMaterialInGroupByName = ( name = '', grp ) => {
			let material = null;
			for ( let i = 0; i < grp.children.length; i++ ) {
				if ( grp.children[ i ].isMesh ) {
					if ( grp.children[ i ].material.name === name ) {
						return grp.children[ i ].material;
					}
				}
			}


			return material;
		};

		switch ( data.name ) {
		case 'vehicleModel':
			data.map.scene.traverse( ( child ) => {
				if ( !child.isMesh ) {
					return undefined;
				}

				// const mat = new THREE.MeshPhysicalMaterial( { color: 'white', metalness: 0.96, roughness: 0.1 } );

				// child.castShadow = true;

				// let prevMaterial = child.material;
				// child.material = new THREE.MeshPhysicalMaterial();
				// THREE.MeshStandardMaterial.prototype.copy.call( child.material, prevMaterial );
				// const name = child.material.name;
				// child.material = mat;
				// child.material.name = name;
			} );

			const body = foundMeshByName( 'body', data.map.scene.children );

			// this.testConvPol( body.children[ 0 ] );

			this.vehicle.materials.body = foundMaterialInGroupByName( 'testCarPaint', body );
			// this.vehicle.materials.body.wireframe = true;
			this.vehicle.materials.body.emissive.setHex( 0x193e14 );


			const suppRF = foundMeshByName( 'frSup', data.map.scene.children );
			const suppLF = foundMeshByName( 'lfSup', data.map.scene.children );
			const suppRR = foundMeshByName( 'rrSup', data.map.scene.children );
			const suppLR = foundMeshByName( 'rlSup', data.map.scene.children );

			this.vehicle.materials.supports.RF = foundMaterialInGroupByName( 'Material.001', suppRF );
			this.vehicle.materials.supports.LF = foundMaterialInGroupByName( 'Material.001', suppLF );
			this.vehicle.materials.supports.RR = foundMaterialInGroupByName( 'Material.001', suppRR );
			this.vehicle.materials.supports.LR = foundMaterialInGroupByName( 'Material.001', suppLR );

			this.vehicle.materials.supports.RF.envMapIntensity = 1.4;
			this.vehicle.materials.supports.LF.envMapIntensity = 1.4;
			this.vehicle.materials.supports.RR.envMapIntensity = 1.4;
			this.vehicle.materials.supports.LR.envMapIntensity = 1.4;

			this.vehicle.supports.RF = suppRF;
			this.vehicle.supports.LF = suppLF;
			this.vehicle.supports.RR = suppRR;
			this.vehicle.supports.LR = suppLR;

			const lightLF = foundMeshByName( 'f_l_light', data.map.scene.children );
			const lightRF = foundMeshByName( 'f_r_light', data.map.scene.children );
			const lightRR = foundMeshByName( 'r_r_light', data.map.scene.children );
			const lightLR = foundMeshByName( 'r_l_light', data.map.scene.children );

			const matLightRF = foundMaterialInGroupByName( 'righTurnLight', lightRF );
			const matLightLF = foundMaterialInGroupByName( 'leftTurnLight', lightLF );

			matLightLF.emissive.setHex( 0x000000 );
			matLightRF.emissive.setHex( 0x000000 );

			this.vehicle.materials.lights.LF = matLightLF;
			this.vehicle.materials.lights.RF = matLightRF;

			const matLightRR = foundMaterialInGroupByName( 'REAR TAIL LIGHT.002', lightRR );
			const matLightLR = foundMaterialInGroupByName( 'REAR TAIL LIGHT.002', lightLR );
			const turnLeftRear = foundMaterialInGroupByName( 'leftReverseLight', lightLR );
			const turnRightRear = foundMaterialInGroupByName( 'rightReverseLight', lightRR );

			this.vehicle.materials.lights.rearTurns.L = turnLeftRear;
			this.vehicle.materials.lights.rearTurns.R = turnRightRear;

			matLightLR.emissive.r = 0.35;
			matLightRR.emissive.r = 0.35;

			this.vehicle.materials.lights.LR = matLightLR;
			this.vehicle.materials.lights.RR = matLightRR;

			this.vehicle.body.add(
				body,
				lightLF,
				lightLR,
				lightRR,
				lightRF,
				this.vehicle.supports.RF,
				this.vehicle.supports.LF,
				this.vehicle.supports.RR,
				this.vehicle.supports.LR );


			this.vehicle.body.createHeadlights();
			this.vehicle.body.setLightsPositions();

			this.vehicle.wheels.RR.add( foundMeshByName( 'r_r_wheel', data.map.scene.children ) );
			this.vehicle.wheels.RF.add( foundMeshByName( 'f_r_wheel', data.map.scene.children ) );
			this.vehicle.wheels.LR.add( foundMeshByName( 'r_l_wheel', data.map.scene.children ) );
			this.vehicle.wheels.LF.add( foundMeshByName( 'f_l_wheel', data.map.scene.children ) );

			const wheel_RR = foundMeshByName( 'r_r_wheel', this.vehicle.wheels.RR.children );
			const wheel_RF = foundMeshByName( 'f_r_wheel', this.vehicle.wheels.RF.children );
			const wheel_LR = foundMeshByName( 'r_l_wheel', this.vehicle.wheels.LR.children );
			const wheel_LF = foundMeshByName( 'f_l_wheel', this.vehicle.wheels.LF.children );

			const carbonDiskLF = foundMaterialInGroupByName( 'carbon disk brake', wheel_LF );
			const carbonDiskRF = foundMaterialInGroupByName( 'carbon disk brake', wheel_RF );
			const carbonDiskLR = foundMaterialInGroupByName( 'carbon disk brake', wheel_LR );
			const carbonDiskRR = foundMaterialInGroupByName( 'carbon disk brake', wheel_RR );

			carbonDiskLF.envMapIntensity = 0.5;
			carbonDiskRF.envMapIntensity = 0.5;
			carbonDiskLR.envMapIntensity = 0.5;
			carbonDiskRR.envMapIntensity = 0.5;

			this.vehicle.materials.rim.LF = foundMaterialInGroupByName( 'frontDisk', wheel_LF );
			this.vehicle.materials.rim.RF = foundMaterialInGroupByName( 'frontDisk', wheel_RF );
			this.vehicle.materials.rim.LR = foundMaterialInGroupByName( 'frontDisk', wheel_LR );
			this.vehicle.materials.rim.RR = foundMaterialInGroupByName( 'frontDisk', wheel_RR );

			this.vehicle.materials.rim.LF.emissive.setHex( 0x8c8c8c );
			this.vehicle.materials.rim.RF.emissive.setHex( 0x8c8c8c );
			this.vehicle.materials.rim.LR.emissive.setHex( 0x8c8c8c );
			this.vehicle.materials.rim.RR.emissive.setHex( 0x8c8c8c );

			const tireLF = foundMaterialInGroupByName( 'tire', wheel_LF );
			const tireRF = foundMaterialInGroupByName( 'tire', wheel_RF );
			const tireLR = foundMaterialInGroupByName( 'tire', wheel_LR );
			const tireRR = foundMaterialInGroupByName( 'tire', wheel_RR );

			const color = 0x181818;

			tireLF.color.setHex( color );
			tireRF.color.setHex( color );
			tireLR.color.setHex( color );
			tireRR.color.setHex( color );

			tireLF.metalness = 1;
			tireRF.metalness = 1;
			tireLR.metalness = 1;
			tireRR.metalness = 1;

			tireLF.roughness = 0.65;
			tireRF.roughness = 0.65;
			tireLR.roughness = 0.65;
			tireRR.roughness = 0.65;


			this.vehicle.body.name = 'body';
			this.vehicle.wheels.LF.name = 'LF';
			this.vehicle.wheels.RF.name = 'RF';
			this.vehicle.wheels.RR.name = 'RR';
			this.vehicle.wheels.LR.name = 'LR';

			data.map = null;

			console.log( this.vehicle );
			break;
		case 'ground_color':
			this.field.forEach( ( ground ) => {
				ground.addMapToMatarial( data.map );
			} );
			break;
		case 'ground_ao':
			this.field.forEach( ( ground ) => {
				ground.addAOMapToMatarial( data.map );
			} );
			break;
		case 'ground_normal':
			this.field.forEach( ( ground ) => {
				ground.addNormalMapToMatarial( data.map );
			} );
			break;
		case 'ground_roughness':
			this.field.forEach( ( ground ) => {
				ground.addRoughnessMapToMatarial( data.map );
			} );
			break;
		case 'ground_displ':
			this.field.forEach( ( ground ) => {
				ground.addDisplMapToMatarial( data.map );
			} );
			break;
		case 'envBox':
			this.scene.background = data.map;
			break;
		case 'headlightsFlare':
			this.vehicle.body.addHeadlightsFlare( data.map );
			break;
		default:
			break;
		}
	}

	loadAllAssets() {

		for ( let i = 0; i < this.vehicle.body.children.length; i++ ) {
			if ( this.vehicle.body.children[ i ].type === 'Group' ) {
				for ( let k = 0; k < this.vehicle.body.children[ i ].children.length; k++ ) {
					this.vehicle.body.children[ i ].children[ k ].material.envMap = this.assetes.get( 'v1' );
				}
			}
		}

		for ( const wheel of Object.values( this.vehicle.wheels ) ) {
			for ( let i = 0; i < wheel.children.length; i++ ) {
				for ( let k = 0; k < wheel.children[ i ].children.length; k++ ) {
					wheel.children[ i ].children[ k ].material.envMap = this.assetes.get( 'v1' );
				}
			}
		}
	}

	addFog() {
		if ( this.scene.background.isTexture ) {
			this.scene.background = this.defBackground;
		}

		this.fog.color = this.scene.background;
		this.scene.fog = this.fog;
	}

	removeFog() {
		if ( this.scene.background.isColor ) {
			this.scene.background = this.assetes.get( 'envBox' );
		}

		this.scene.fog = null;
	}

	changeControlMaxDist() {
		this.controls.maxDistance = this.settings.controlsMaxDist;
	}

	changeControlMaxAngle() {
		this.controls.maxPolarAngle = this.settings.controlsMaxAngle;
	}

	shadowUpdate( status ) {
		if ( this.sceneLight ) {
			this.sceneLight.castShadow = status;
		}
	}

	addSceneLight() {
		// this.sceneLight = new THREE.PointLight( 'white' );
		// this.sceneLightHelper = new THREE.PointLightHelper( this.sceneLight );

		this.sceneLight = new THREE.DirectionalLight( 'white' );
		// this.sceneLightHelper = new THREE.DirectionalLightHelper( this.sceneLight );
		this.sceneLight.target.position.copy( this.camera.position );

		this.sceneLight.position.x = 300;
		this.sceneLight.position.y = 230;
		this.sceneLight.position.z = 60;


		// this.sceneLight.castShadow = false;
		// this.sceneLight.shadow.camera.near = 1;
		// this.sceneLight.shadow.camera.far = 1000;
		// this.sceneLight.shadow.bias = -0.001;

		// this.sceneLight.shadow.mapSize.width = 1024;
		// this.sceneLight.shadow.mapSize.height = 1024;

		const skyColor = 0xB1E1FF;
		const groundColor = 0xB97A20;

		const light = new THREE.HemisphereLight( skyColor, groundColor, 0.5 );
		// new THREE.AmbientLight( 'white', 0.3 );

		this.scene.add( light );
		this.scene.add( this.sceneLight );
		this.scene.add( this.sceneLight.target );
		// this.scene.add( this.sceneLightHelper );

	}

	resizeAction() {
		this.camera.aspect = this.canvas.width / this.canvas.height;
		this.camera.updateProjectionMatrix();
	}

	updateScene() {
		this.updateSceneLight();
		this.updateControls();
	}

	updateControls() {
		this.controls.target.copy( this.vehicle.body.position );
		this.controls.update();
	}

	updateSceneLight() {
		// this.sceneLight.target.updateMatrixWorld();
		// this.sceneLightHelper.update();
		// this.sceneLight.position.y = 100 + this.settings.sceneLightBias;
		// this.sceneLight.position.x = this.vehicle.body.position.x + 30;
		// this.sceneLight.position.y = this.vehicle.body.position.y + 25 + this.settings.sceneLightBias;
		// this.sceneLight.position.z = this.vehicle.body.position.z + 30;
	}

	updateActors() {
		this.vehicle.update();
	}

	update() {
		this.updateActors();
		this.updateScene();
	}
}

export { VehicleScene };
