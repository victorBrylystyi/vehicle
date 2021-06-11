import { Film } from "../../cores/Film";
import { GraphicCore } from "./graphic/GraphicCore";
import { LoaderIndicator } from "./graphic/LoaderIndicator";
import { UIController } from "./graphic/scenes/UIController";
import { PhysicCore } from "./physic/PhysicCore";


class VehicleFilm extends Film{
    constructor(display,resources){
        super();
        // this.settings = {
        //     useCssLoader: false,
        // };
        // this.loaderBar = new LoaderIndicator(display);
        this.ui = new UIController(this);
        this.cores.graphic = new GraphicCore(display,resources,this.ui);
        this.cores.physic = new PhysicCore();
        document.onkeydown = this.handler;
        document.onkeyup = this.handler;
        document.film = this;
    }
    handler(event){ 

        let keyUp = (event.type == 'keyup');

        switch(event.code){
        case 'KeyV':
            (keyUp) ? document.film.ui.changeVisibleGUI() : null ;
            break;
            case 'KeyL':
                (keyUp) ? document.film.cores.graphic.currentScene.vehicle.changeBodyHeadlightsVisible() : null;
                break;
        }

        document.film.cores.graphic.currentScene.vehicle.handler(event);

    }
}
export { VehicleFilm };