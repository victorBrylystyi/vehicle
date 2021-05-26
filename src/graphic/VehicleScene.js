import * as THREE from "three";

class VehicleScene {
    constructor(canvas){
        this.name = 'vehicle scene';
        this.assetes = null;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, this.canvas.clientWidth / this.canvas.clientHeight, 1, 2000 );
        this.init();
    }
    init(){
        this.camera.position.z = 1000;
        this.scene = new THREE.Scene();
        this.scene.background =  new THREE.Color(0xeeeeee);
        const near = 5;
        const far = 200;
        //this.scene.fog = new THREE.Fog(this.scene.background, near, far);//new THREE.Color(0x181717)
        this.box = new THREE.Mesh(new THREE.BoxGeometry(654,500,654),new THREE.MeshBasicMaterial({color:new THREE.Color('red')}));
        
        this.scene.add(this.box);

    }
    resizeAction(){
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }
    update(fi){
        this.box.rotation.x=fi;
        this.box.rotation.y=fi;
    }
}

export { VehicleScene };