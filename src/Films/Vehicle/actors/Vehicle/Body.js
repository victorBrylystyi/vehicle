import { GObject } from "../GObject";
import * as CANNON from "cannon";
import * as THREE from "three";

class Body extends GObject{
    constructor (phW,dim,mass){
        super(phW);
        this.dim = dim;
        this.mass = mass;
        this.physicMeshMatrtial = new THREE.MeshBasicMaterial({color: "red", wireframe: false, side: THREE.DoubleSide});
        this.init();
        return this;
    }
    init(){
        this.createBody();
        this.graphic.physicMesh = this.createPhysicMesh();
        this.graphic.physicMesh.visible = false;
        this.graphic.physicMesh.name = 'vehicleBody';
        this.add(this.graphic.physicMesh);
    }
    createBody(){
        let chassisShape = new CANNON.Box(new CANNON.Vec3(this.dim.x/2.1, this.dim.y/2.5, this.dim.z/3));
        this.physicBody = new CANNON.Body({ 
            mass: this.mass, 
        });
        this.physicBody.name = 'vehicle body';
        this.physicBody.addShape(chassisShape);
        this.physicBody.position.set(11, 15, 4);
        let qR = new CANNON.Quaternion();
        qR.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        this.physicBody.quaternion = qR;
        this.physicBody.angularVelocity.set(0, 0, 0.5);
    }
    createHeadlights(){
        this.headLights = {
            LF: new THREE.SpotLight(),
            RF: new THREE.SpotLight(),
        };

        this.headLights.LF.name = 'lf';
        this.headLights.LF.target.name = 'lf_t';

        this.headLights.LF.intensity = 2;
        this.headLights.LF.penumbra = 0.24;
        this.headLights.LF.distance = 100;
        this.headLights.LF.angle = 1.1;
        this.headLights.LF.target.position.x = 100;
        this.headLights.LF.target.position.z = -21;

        this.headLights.RF.name = 'rf';
        this.headLights.RF.target.name = 'rf_t';

        this.headLights.RF.intensity = 2;
        this.headLights.RF.penumbra = 0.24;
        this.headLights.RF.distance = 100;
        this.headLights.RF.angle = 1.1;
        this.headLights.RF.target.position.x = 100;
        this.headLights.RF.target.position.z = -21;

        this.headLights.LF.visible = false;
        this.headLights.RF.visible = false;

        this.add(this.headLights.LF, this.headLights.LF.target,
                 this.headLights.RF, this.headLights.RF.target);
    }
    headlightHelp(angle){
        if (this.headLights){
            let helpLF=0,helpRF=0;
            let power = 50;
      
            if (angle>0){
              helpLF = Math.sin(angle)*power;
              helpRF = 0;
            } else {
              helpRF = Math.sin(angle)*power;
              helpLF = 0;
            }
      
            this.headLights.LF.target.position.y = this.headLights.LF.position.y + helpLF;
            this.headLights.RF.target.position.y = this.headLights.RF.position.y + helpRF;
          }
    }
    setLightsPositions(){

        const front = {
          x: 17.8,
          y: 5.53,
          z: -0.6
        };
    
        const rear = {
          x: -16.9,
          y: 4.3,
          z: 1 
        };
        
        const flLight = this.foundMeshByName('f_l_light',this.children);
        const frLight = this.foundMeshByName('f_r_light',this.children);
        const rlLight = this.foundMeshByName('r_l_light',this.children);
        const rrLight = this.foundMeshByName('r_r_light',this.children);
    
        flLight.position.set(front.x,front.y,front.z);
        frLight.position.set(front.x,-front.y,front.z);
        rlLight.position.set(rear.x,rear.y,rear.z);
        rrLight.position.set(rear.x,-rear.y,rear.z);
    
        this.foundMeshByName('lf',this.children).position.set(flLight.position.x+0.35,flLight.position.y,flLight.position.z);
        this.foundMeshByName('rf',this.children).position.set(frLight.position.x+0.35,frLight.position.y,frLight.position.z);
    }
    
}

export { Body };