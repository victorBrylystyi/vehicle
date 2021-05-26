import { GUI } from "dat.gui";
import { GraphicCore } from "./graphic/GraphicCore";
import { PhysicCore } from "./physic/PhysicCore";

class App {
    constructor(element=null,resources=null){
        this.name = 'Top Manager';
        this.cores = {
            graphic: new GraphicCore(element,resources),
            physic: new PhysicCore(),
        };
        this.ui = new GUI();
        this.init();
        return this;
    }
    greeting(){
        console.log(`Hi! I am ${this.name}. Welcome to App.js =)`);
        for ( const core of Object.values(this.cores)){
            core.greeting();
        }
    }
    init(){
        for ( const core of Object.values(this.cores)){
            core.init();
        }
        console.log('done init');
    }
    run(){
        for ( const core of Object.values(this.cores)){
            core.run();
        }
        return 'run app';
    }
    stop(){
        for ( const core of Object.values(this.cores)){
            core.stop();
        }
        return 'stop app';
    }
    runGraphic(){
        return this.cores.graphic.run();
    }
    runPhysic(){
        return this.cores.physic.run();
    }
    stopGraphic(){
        return this.cores.graphic.stop();
    }
    stopPhysic(){
        return this.cores.physic.stop();
    }
}

export { App };
