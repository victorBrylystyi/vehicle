import { Core } from "./Core";

class Film extends Core{
    constructor(){
        super();
        this.cores = {
            graphic: null,
            physic: null,
        };
        this.ui = null;
    }
    init(){
        if (this.cores.physic) this.cores.physic.init();
        if (this.cores.graphic) {
            this.cores.graphic.getPhysicWorld(this.cores.physic.currentWorld);
            this.cores.graphic.init();
        }
    }
    preStart(){
        if (this.cores.physic) this.cores.physic.preStart();
        if (this.cores.graphic) this.cores.graphic.preStart();
    }
    update(){
        if (this.cores.physic) this.cores.physic.update();
        if (this.cores.graphic) this.cores.graphic.update();
    }
    postStart(){
        if (this.cores.physic) this.cores.physic.postStart();
        if (this.cores.graphic) this.cores.graphic.postStart();
    }
}

export { Film };