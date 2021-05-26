import { Core } from "../Core";
import * as CANNON from "cannon";

class PhysicCore extends Core{
    constructor(){
        super();
        this.world = new CANNON.World();
        this.name = 'cannon.js app';
    }
    greeting(){
        console.log(`Hi! I am ${this.name} =)`);
    }
    init(){

    }
    run(){
        console.log('run ph');
        return 'run physic core';
    }
    stop(){
        console.log('stop ph');
        return 'stop physic core';
    }
}

export { PhysicCore }