
import * as THREE from "three";
import { GraphicLoader } from "./GraphicLoader";
import { Core } from "../Core";
import { VehicleScene } from "./VehicleScene";

class GraphicCore extends Core{
    constructor(element=null,resources=null){
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
        this.processId = null;
        this.prepareCanvas();
        return this; 
    }
    greeting(){
        console.log(`Hi! I am ${this.name} =)`);
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
    run(){
        this.loadAssets();
        return 'run graphic core';
    }
    stop(){
        this.stopAnimation();
        return 'stop graphic core';
    }
    loadAssets(){
        this.loader.on('start',()=>{
            
        });
        this.loader.on('progress',()=>{
            
        });
        this.loader.on('load',()=>{
            
        });
        this.startAnimation();
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
        this.currentScene = new VehicleScene(this.canvas);
        this.currentScene.init();
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
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
    startAnimation(){
        this.threeClock.start();
        this.render();
    }
    stopAnimation(){
        this.threeClock.stop();
        cancelAnimationFrame(this.processId);
    }
    animate(){
        this.appConfig.fi += this.appConfig.speed * this.threeClock.getDelta() * this.appConfig.fps;
        this.currentScene.update(this.appConfig.fi);  
        this.renderer.render(this.currentScene.scene,this.currentScene.camera);
    }
    render(){
        this.animate();
        this.processId = requestAnimationFrame(()=>{
            this.render();
        });
    }


}

export { GraphicCore };