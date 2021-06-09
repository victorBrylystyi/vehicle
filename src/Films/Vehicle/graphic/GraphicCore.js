
import * as THREE from "three";
import { GraphicLoader } from "./GraphicLoader";
import { Core } from "../../../cores/Core";
import { VehicleScene } from "./scenes/VehicleScene";

class GraphicCore extends Core{
    constructor(element=null,resources=null,ui=null){
        super();
        this.name = 'three.js app';
        this.domElement = element;
        this.loader = new GraphicLoader(resources);
        this.currentScene = null;
        this.appConfig = {
            fps: 60,
            dT: 0,
            tPrev: window.performance.now(),
            speed: 0.001,
            fi: 0,
        };
        this.currentPhysicWorld = null;
        this.ui = ui;
        this.prepareCanvas();
        return this; 
    }
    getPhysicWorld(world){
        this.currentPhysicWorld = world;
    }
    init(){
       this.renderer = new THREE.WebGLRenderer({
           canvas: this.canvas,
           antialias: true,
        });

        this.threeClock = new THREE.Clock();

        window.addEventListener('resize',()=>{
            this.resize();
        });
        this.currentScene = new VehicleScene(this.canvas,this.currentPhysicWorld);

        console.log('THREE done init');
    }
    preStart(){
        this.startLoadAssets();
        this.threeClock.start();
        console.log('THREE done prestart');
    }
    update(){
        this.animate();
    }
    postStart(){
        this.threeClock.stop();
    }
    animate(){
        this.appConfig.fi += this.appConfig.speed * this.threeClock.getDelta() * this.appConfig.fps;
        this.currentScene.update(this.appConfig.fi);  
        this.renderer.render(this.currentScene.scene,this.currentScene.camera);
    }
    resize(){
        if (!this.domElement){
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
        } else {
            this.canvas.width = this.domElement.clientWidth;
            this.canvas.height = this.domElement.clientHeight;
        }
        this.currentScene.resizeAction();
        this.renderer.setSize(this.canvas.width, this.canvas.height);
    }
    startLoadAssets(){
        if (!this.currentScene.assetes){

            this.loader.on('start',()=>{
            
            });

            this.loader.on('progress',(d)=>{
                this.currentScene.addAssets(d);
                console.log(Math.round(d.value * 100) + '%');
            });

            this.loader.on('load',(result)=>{
                this.currentScene.assetes = result;
                this.currentScene.loadAllAssets();
                this.ui.init();
                //console.log(this.currentScene.ground);
            });

            this.loader.load();

        }
    }
    prepareCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas';

        if (!this.domElement){
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            document.body.appendChild(this.canvas);
            return;
        }
        this.canvas.width = this.domElement.clientWidth;
        this.canvas.height = this.domElement.clientHeight;
        this.domElement.appendChild(this.canvas);
    }
}

export { GraphicCore };