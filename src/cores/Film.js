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
        //if (this.ui) this.ui.init();
        // for ( const core of Object.values(this.cores)){
        //     if (core) core.init();
        // }
    }
    preStart(){
        if (this.cores.physic) this.cores.physic.preStart();
        if (this.cores.graphic) this.cores.graphic.preStart();

        // for ( const core of Object.values(this.cores)){
        //     if (core) core.preStart();
        // }
    }
    update(){
        if (this.cores.physic) this.cores.physic.update();
        if (this.cores.graphic) this.cores.graphic.update();

        // for ( const core of Object.values(this.cores)){
        //     if (core) core.update();
        // }
    }
    postStart(){
        if (this.cores.physic) this.cores.physic.postStart();
        if (this.cores.graphic) this.cores.graphic.postStart();

        // for ( const core of Object.values(this.cores)){
        //     if (core) core.postStart();
        // }
    }
}

export { Film };