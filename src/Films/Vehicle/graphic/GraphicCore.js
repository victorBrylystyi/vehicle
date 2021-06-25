/* eslint-disable no-empty-function */

import * as THREE from 'three';
import { GraphicLoader } from './GraphicLoader';
import { Core } from '../../../cores/Core';
import { VehicleScene } from './scenes/VehicleScene';
import { LoaderIndicator } from './LoaderIndicator';
import { Timer } from './Timer';

class GraphicCore extends Core {
	constructor( element = null, resources = null, ui = null ) {
		super();
		this.name = 'three.js app';
		this.domElement = element;
		this.useCssLoader = true;
		this.cssLoaderBar = null;
		this.loader = new GraphicLoader( resources );
		this.currentScene = null;
		this.appConfig = {
			fps: 60,
			dT: 0,
			tPrev: window.performance.now(),
			speed: 0.001,
			fi: 0
		};
		this.timer = null;
		this.guideMenu = null;
		this.currentPhysicWorld = null;
		this.ui = ui;

		return this;
	}

	getPhysicWorld( world ) {
		this.currentPhysicWorld = world;
	}

	init() {
		this.timer = new Timer();

		this.prepareCanvas( this.domElement );

		if ( this.useCssLoader ) {
			this.cssLoaderBar = new LoaderIndicator( this.domElement );
		} else if ( this.domElement ) {
			this.domElement.appendChild( this.canvas );
		} else {
			document.body.appendChild( this.canvas );
		}

		this.renderer = new THREE.WebGLRenderer( {
			canvas: this.canvas,
			antialias: true
			// logarithmicDepthBuffer: true
		} );
		// this.renderer.shadowMap.enabled = false;
		// this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.threeClock = new THREE.Clock();

		window.addEventListener( 'resize', () => {
			this.resize();
		} );
		this.currentScene = new VehicleScene( this.canvas, this.currentPhysicWorld, this.timer );

		console.log( 'THREE done init' );
	}

	visuShadows( status ) {
		this.renderer.shadowMap.enabled = status;
		this.currentScene.shadowUpdate( status );
	}

	preStart() {
		this.startLoadAssets();
		this.threeClock.start();
		if ( this.timer ) {
			this.timer.preStart();
		}

		console.log( 'THREE done prestart' );
	}

	update() {
		if ( this.timer ) {
			this.timer.update();
		}

		this.animate();
	}

	postStart() {
		this.threeClock.stop();
		if ( this.timer ) {
			this.timer.postStart();
		}
	}


	animate() {
		this.appConfig.fi += this.appConfig.speed * this.threeClock.getDelta() * this.appConfig.fps;
		this.currentScene.update( this.appConfig.fi );
		this.renderer.render( this.currentScene.scene, this.currentScene.camera );
	}

	resize() {
		if ( this.domElement ) {

			if ( this.cssLoaderBar ) {
				this.cssLoaderBar.resize();
			}

			this.renderer.setSize( this.domElement.clientWidth, this.domElement.clientHeight );

		} else {

			this.renderer.setSize( window.innerWidth, window.innerHeight );
		}

		this.currentScene.resizeAction();
	}

	startLoadAssets() {
		if ( !this.currentScene.assetes ) {

			this.loader.on( 'start', () => {

			} );

			this.loader.on( 'progress', ( d ) => {
				this.currentScene.addAssets( d );
				console.log( `${ Math.round( d.value * 100 ) }%` );
			} );

			this.loader.on( 'load', ( result ) => {

				if ( this.useCssLoader ) {

					this.useCssLoader = false;

					if ( this.domElement ) {
						this.domElement.removeChild( this.cssLoaderBar.holder );
						this.domElement.appendChild( this.canvas );
					} else {
						document.body.removeChild( this.cssLoaderBar.holder );
						document.body.appendChild( this.canvas );
					}

					this.cssLoaderBar = null;

					this.resize();
					this.createGuideMenu();
				}

				this.currentScene.assetes = result;
				this.currentScene.loadAllAssets();
				this.ui.init();
			} );

			this.loader.load();

		}
	}

	chageStatusGuideMenu( status = '' ) {
		document.querySelector( '.guide' ).style.visibility = status;
	}

	createGuideMenu() {

		const guideMenu = document.createElement( 'div' );
		guideMenu.className = 'guide';

		guideMenu.style.position = 'fixed';
		guideMenu.style.zIndex = '999';
		guideMenu.style.top = '0';
		guideMenu.style.left = '0';
		guideMenu.style.margin = '5px';

		const text = {
			wasd: {
				element: document.createElement( 'p' ),
				textContent: 'W, A, S, D - Movement controls'
			},
			w: {
				element: document.createElement( 'p' ),
				textContent: 'W - Forward'
			},
			a: {
				element: document.createElement( 'p' ),
				textContent: 'A - Turn Left'
			},
			s: {
				element: document.createElement( 'p' ),
				textContent: 'S - Stop/Backward'
			},
			d: {
				element: document.createElement( 'p' ),
				textContent: 'D - Turn Right'
			},
			l: {
				element: document.createElement( 'p' ),
				textContent: 'L - On/Off Headlights'
			},
			v: {
				element: document.createElement( 'p' ),
				textContent: 'V - On/Off Controls'
			},
			space: {
				element: document.createElement( 'p' ),
				textContent: 'Space - Handbreake'
			},
			r: {
				element: document.createElement( 'p' ),
				textContent: 'R - Reset vehicle'
			}

		};

		text.wasd.element.textContent = text.wasd.textContent;
		guideMenu.appendChild( text.wasd.element );

		text.r.element.textContent = text.r.textContent;
		guideMenu.appendChild( text.r.element );

		text.l.element.textContent = text.l.textContent;
		guideMenu.appendChild( text.l.element );

		text.v.element.textContent = text.v.textContent;
		guideMenu.appendChild( text.v.element );

		text.space.element.textContent = text.space.textContent;
		guideMenu.appendChild( text.space.element );

		if ( this.domElement ) {
			this.domElement.appendChild( guideMenu );
		} else {
			document.body.appendChild( guideMenu );
		}
	}

	prepareCanvas( inpElement ) {
		this.canvas = document.createElement( 'canvas' );
		this.canvas.id = 'canvas';

		if ( inpElement ) {
			this.canvas.width = inpElement.clientWidth;
			this.canvas.height = inpElement.clientHeight;
		} else {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}
	}
}

export { GraphicCore };
