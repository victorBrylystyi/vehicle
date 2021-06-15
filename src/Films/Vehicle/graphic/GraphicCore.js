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
		if ( this.useCssLoader ) {
			this.cssLoaderBar = new LoaderIndicator( this.domElement );
			this.prepareCanvas( this.domElement );
			this.canvas.style.display = 'none';
			this.cssLoaderBar.addElementToHolder( this.canvas );
		} else {
			this.prepareCanvas( this.domElement );
			this.domElement.appendChild( this.canvas );
		}

		this.renderer = new THREE.WebGLRenderer( {
			canvas: this.canvas,
			antialias: true
		} );

		this.threeClock = new THREE.Clock();

		window.addEventListener( 'resize', () => {
			this.resize();
		} );
		this.currentScene = new VehicleScene( this.canvas, this.currentPhysicWorld, this.timer );

		console.log( 'THREE done init' );
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
			if ( this.useCssLoader ) {
				this.cssLoaderBar.holder.style.width = `${ this.domElement.clientWidth }px`;
				this.cssLoaderBar.holder.style.height = `${ this.domElement.clientHeight }px`;
			}

			this.canvas.width = this.domElement.clientWidth;
			this.canvas.height = this.domElement.clientHeight;

		} else {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}

		this.currentScene.resizeAction();
		this.renderer.setSize( this.canvas.width, this.canvas.height );
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
					this.finishLoad();
					this.createGuideMenu();
				}

				this.currentScene.assetes = result;
				this.currentScene.loadAllAssets();
				this.ui.init();
			} );

			this.loader.load();

		}
	}

	finishLoad() {
		this.cssLoaderBar.loaderElem.style.display = 'none';
		this.canvas.style.display = 'block';
		this.resize();
	}

	chageStatusGuideMenu( status = '' ) {
		this.guideMenu.style.visibility = status;
	}

	createGuideMenu() {
		this.guideMenu = document.createElement( 'div' );
		this.guideMenu.className = 'guide';

		this.guideMenu.style.position = 'fixed';
		this.guideMenu.style.zIndex = '999';
		this.guideMenu.style.top = '0';
		this.guideMenu.style.left = '0';
		this.guideMenu.style.margin = '5px';

		this.cssLoaderBar.holder.appendChild( this.guideMenu );


		this.text = {
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
		this.text.wasd.element.textContent = this.text.wasd.textContent;
		this.guideMenu.appendChild( this.text.wasd.element );

		// this.text.w.element.textContent = this.text.w.textContent;
		// this.guideMenu.appendChild(this.text.w.element);

		// this.text.a.element.textContent = this.text.a.textContent;
		// this.guideMenu.appendChild(this.text.a.element);

		// this.text.s.element.textContent = this.text.s.textContent;
		// this.guideMenu.appendChild(this.text.s.element);

		// this.text.d.element.textContent = this.text.d.textContent;
		// this.guideMenu.appendChild(this.text.d.element);

		this.text.r.element.textContent = this.text.r.textContent;
		this.guideMenu.appendChild( this.text.r.element );

		this.text.l.element.textContent = this.text.l.textContent;
		this.guideMenu.appendChild( this.text.l.element );

		this.text.v.element.textContent = this.text.v.textContent;
		this.guideMenu.appendChild( this.text.v.element );

		this.text.space.element.textContent = this.text.space.textContent;
		this.guideMenu.appendChild( this.text.space.element );
	}

	prepareCanvas( inpElement ) {
		this.canvas = document.createElement( 'canvas' );
		this.canvas.id = 'canvas';

		// if (!this.domElement){
		//     this.canvas.width = window.innerWidth;
		//     this.canvas.height = window.innerHeight;
		//     document.body.appendChild(this.canvas);
		//     return;
		// }
		this.canvas.width = inpElement.clientWidth;
		this.canvas.height = inpElement.clientHeight;
		// inpElement.appendChild(this.canvas);
	}
}

export { GraphicCore };
