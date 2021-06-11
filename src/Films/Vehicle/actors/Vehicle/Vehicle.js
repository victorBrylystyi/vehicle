import * as CANNON from "cannon";
import { Body } from "./Body";
import { Wheel } from "./Wheel";


class Vehicle {
    constructor(physicWorld,cntrls){
        this.physicWorld = physicWorld;
        this.controls = cntrls;
        this.bodyMass = 1700;
        this.wheelMass = 30;
        this.mainDim = {
            body: {
                x: 2.69,
                y: 1.1,
                z: 0.71,
            },
            wheel:{
                x: 0.366,
                y: 0.157,
                z: 0.366,
            },
            scaleOriginal: 15,
        };
        this.materials = {
          body: null,
          rim: {
            LF: null,
            RF: null,
            LR: null,
            RR: null,
          },
          lights:{
            LR: null,
            RR: null,
            LF: null,
            RF: null,
          },
        };
        this.settings = {
          maxEngineForce: 5000,
          maxBrakeForce: 500,
          steering:{
            angle: 0,
            stw: 0,
          },
          typeDrive: {
            front: false,
            rear: false,
            full: true,
          }
        };
        this.connectionPointsWheels = {
          LF: new CANNON.Vec3(13.6, 6.9, -3.3),
          RF: new CANNON.Vec3(13.6, -6.9, -3.3),
          LR: new CANNON.Vec3(-10, 6.7, -3.3),
          RR: new CANNON.Vec3(-10, -6.7, -3.3)
        };
        this.init();
        return this;
    }
    init(){
      this.dim = this.calculateRealDim();
      this.body = new Body(this.physicWorld,this.dim.body,this.bodyMass);
      this.wheels = {
        LF: new Wheel(this.physicWorld,this.dim.wheel,this.wheelMass,'LF'),
        RF: new Wheel(this.physicWorld,this.dim.wheel,this.wheelMass,'RF'),
        LR: new Wheel(this.physicWorld,this.dim.wheel,this.wheelMass,'LR'),
        RR: new Wheel(this.physicWorld,this.dim.wheel,this.wheelMass,'RR'),
      };
      this.wheelOptions = {
        radius: this.dim.wheel.x/2,
        directionLocal: new CANNON.Vec3(0, 0, -1),
        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        frictionSlip: 7,
        dampingRelaxation: 1.5, // 2.3  gui 
        dampingCompression: 1.5,//4.4 gui 
        maxSuspensionForce: 100000,
        rollInfluence:  0.06, //0.01
        axleLocal: new CANNON.Vec3(0, 1, 0),
        chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
        maxSuspensionTravel: 0.3,//0.3
        customSlidingRotationalSpeed: -10,
        useCustomSlidingRotationalSpeed: true
      };
      this.createRaycastVehicle();
    }
    changeTypeDrive(type = ''){
      switch(type){
        case 'Front':
            this.settings.typeDrive.front = true;
            this.settings.typeDrive.full  = false;
            this.settings.typeDrive.rear  = false;
            break;
            case 'Rear':
                this.settings.typeDrive.front = false;
                this.settings.typeDrive.full  = false;
                this.settings.typeDrive.rear  = true;
                break;
                case 'Full':
                    this.settings.typeDrive.front = false;
                    this.settings.typeDrive.full  = true;
                    this.settings.typeDrive.rear  = false;
                    break;
      }
    }
    changeBodyHeadlightsVisible(v=undefined){
      if (v === undefined){
        this.body.headLights.LF.visible = !this.body.headLights.LF.visible;
        this.body.headLights.RF.visible = !this.body.headLights.RF.visible;

        (this.body.headLights.LF.visible) ? this.materials.lights.LF.emissive.setHex(0xffffff) : 
        this.materials.lights.LF.emissive.setHex(0x000000);

        (this.body.headLights.RF.visible) ? this.materials.lights.RF.emissive.setHex(0xffffff) : 
        this.materials.lights.RF.emissive.setHex(0x000000);

      } else {
        this.body.headLights.LF.visible = v;
        this.body.headLights.RF.visible = v;
        if (v){
          this.materials.lights.LF.emissive.setHex(0xffffff);
          this.materials.lights.RF.emissive.setHex(0xffffff);
        } else {
          this.materials.lights.LF.emissive.setHex(0x000000);
          this.materials.lights.RF.emissive.setHex(0x000000);
        }
      }



    }
    changeFrictionSlip(f){
      this.raycastVehicle.wheelInfos[0].frictionSlip = f;
      this.raycastVehicle.wheelInfos[1].frictionSlip = f;
      this.raycastVehicle.wheelInfos[2].frictionSlip = f;
      this.raycastVehicle.wheelInfos[3].frictionSlip = f;
    }
    changeMaxEngineForce(e){
      this.settings.maxEngineForce = e;
    }
    changeMaxBrakeForce(b){
      this.settings.maxBrakeForce = b;
    }

    handler(event){
      const keyUp = (event.type == 'keyup');
      switch(event.code){
        case 'KeyW':
          this.setEngineForce(keyUp ? 0 : -this.settings.maxEngineForce);
          break;
          case 'KeyS':
            if (!keyUp){
              if (this.raycastVehicle.currentVehicleSpeedKmHour>0) {
                this.setBreakeForce(this.settings.maxBrakeForce);
              } else {
                if (this.raycastVehicle.wheelInfos[0].brake>0){
                  this.relaxBreake();
                }
                this.setEngineForce(this.settings.maxEngineForce);
              }
            } else {
              this.relaxBreake();
              this.setEngineForce(0);
            }
            break;
            case 'KeyA':
              keyUp ? this.settings.steering.angle  = 0 : 
              (this.settings.steering.angle <0.55) ? this.setSteeringAngle(0.1) : this.setSteeringAngle();
              break;
              case 'KeyD':
                keyUp ? this.settings.steering.angle  = 0 : 
                (this.settings.steering.angle >-0.55) ? this.setSteeringAngle(-0.1) : this.setSteeringAngle();
                break;
                case 'KeyR':
                    this.resetVehicle();         
                  break;
                  case 'Space':
                    if (keyUp){
                      this.relaxBreake();
                      this.setEngineForce(0);
                    } else {
                      this.raycastVehicle.setBrake(this.settings.maxBrakeForce, 2);
                      this.raycastVehicle.setBrake(this.settings.maxBrakeForce, 3);
                    }
                    break;
      };
    }
    setSteeringAngle(value = 0){
      this.settings.steering.angle  += value;
    }
    relaxBreake(){
      this.raycastVehicle.setBrake(0, 0);
      this.raycastVehicle.setBrake(0, 1);
      this.raycastVehicle.setBrake(0, 2);
      this.raycastVehicle.setBrake(0, 3);
    }
    updateLightHelper(){
      this.body.headlightHelp(this.settings.steering.stw);
    }
    setBreakeForce(breakForce){
      if (this.raycastVehicle.currentVehicleSpeedKmHour>0){
        this.raycastVehicle.setBrake(breakForce/3, 0);
        this.raycastVehicle.setBrake(breakForce/3, 1);
        this.raycastVehicle.setBrake(breakForce, 2);
        this.raycastVehicle.setBrake(breakForce, 3);
      } else {
        this.raycastVehicle.setBrake(breakForce, 0);
        this.raycastVehicle.setBrake(breakForce, 1);
        this.raycastVehicle.setBrake(breakForce/2, 2);
        this.raycastVehicle.setBrake(breakForce/2, 3);
      }

    }
    setEngineForce(force){
      (this.settings.typeDrive.full || this.settings.typeDrive.front) ? this.raycastVehicle.applyEngineForce((this.settings.typeDrive.front) ? 1.7 * force : force, 0) : null;
      (this.settings.typeDrive.full || this.settings.typeDrive.front) ? this.raycastVehicle.applyEngineForce((this.settings.typeDrive.front) ? 1.7 * force : force, 1) : null;
      (this.settings.typeDrive.full || this.settings.typeDrive.rear)  ? this.raycastVehicle.applyEngineForce((this.settings.typeDrive.rear)  ? 1.7 * force : force, 2) : null;
      (this.settings.typeDrive.full || this.settings.typeDrive.rear)  ? this.raycastVehicle.applyEngineForce((this.settings.typeDrive.rear)  ? 1.7 * force : force, 3) : null;
    }
    resetVehicle(){
      // Position
      this.raycastVehicle.chassisBody.position.set(11, 15, 4);
      this.raycastVehicle.chassisBody.previousPosition.setZero();
      this.raycastVehicle.chassisBody.interpolatedPosition.setZero();
      this.raycastVehicle.chassisBody.initPosition.setZero();
  
      // // orientation
      this.raycastVehicle.chassisBody.quaternion.set(-1,0,0,1);
      this.raycastVehicle.chassisBody.initQuaternion.set(0,0,0,1);
      this.raycastVehicle.chassisBody.interpolatedQuaternion.set(0,0,0,1);
  
      // Velocity
      this.raycastVehicle.chassisBody.velocity.setZero();
      this.raycastVehicle.chassisBody.initVelocity.setZero();
      this.raycastVehicle.chassisBody.angularVelocity.setZero();
      this.raycastVehicle.chassisBody.initAngularVelocity.setZero();
  
      // Force
      this.raycastVehicle.chassisBody.force.setZero();
      this.raycastVehicle.chassisBody.torque.setZero();
  
      // Sleep state reset
      this.raycastVehicle.chassisBody.sleepState = 0;
      this.raycastVehicle.chassisBody.timeLastSleepy = 0;
      this.raycastVehicle.chassisBody._wakeUpAfterNarrowphase = false;
    }
    steeringControll(angle){
      let delta = 0;
      delta = angle - this.settings.steering.stw;
      
      this.settings.steering.stw += delta / 7;
    
      this.raycastVehicle.setSteeringValue((this.settings.steering.stw), 0);
      this.raycastVehicle.setSteeringValue((this.settings.steering.stw), 1);
    }
    updateRearLights(){
      if (this.materials.lights.LR && this.materials.lights.RR){
        if (this.raycastVehicle.wheelInfos[0].brake>0 || 
          this.raycastVehicle.wheelInfos[1].brake>0 ||
          this.raycastVehicle.wheelInfos[2].brake>0 ||
          this.raycastVehicle.wheelInfos[3].brake>0){
            this.materials.lights.LR.emissive.r = 0.7;
            this.materials.lights.RR.emissive.r = 0.7;
          } else {
            this.materials.lights.LR.emissive.r = 0.35;
            this.materials.lights.RR.emissive.r = 0.35;
          }
      }
    }

    createRaycastVehicle(){

      this.raycastVehicle = new CANNON.RaycastVehicle({
        chassisBody: this.body.physicBody,
      });

      this.wheelOptions.chassisConnectionPointLocal.copy(this.connectionPointsWheels.LF);
      this.raycastVehicle.addWheel(this.wheelOptions);

      this.wheelOptions.chassisConnectionPointLocal.copy(this.connectionPointsWheels.RF);
      this.raycastVehicle.addWheel(this.wheelOptions);

      this.wheelOptions.chassisConnectionPointLocal.copy(this.connectionPointsWheels.LR);
      this.raycastVehicle.addWheel(this.wheelOptions);

      this.wheelOptions.chassisConnectionPointLocal.copy(this.connectionPointsWheels.RR);
      this.raycastVehicle.addWheel(this.wheelOptions);

      this.wheels.LF.raycastVehicleWheel = this.raycastVehicle.wheelInfos[0];
      this.wheels.RF.raycastVehicleWheel = this.raycastVehicle.wheelInfos[1];
      this.wheels.LR.raycastVehicleWheel = this.raycastVehicle.wheelInfos[2];
      this.wheels.RR.raycastVehicleWheel = this.raycastVehicle.wheelInfos[3];

      this.raycastVehicle.addToWorld(this.physicWorld.world);

      this.physicWorld.raycastVehicle = this.raycastVehicle;
      this.physicWorld.wheels = this.wheels;
    }
    update(){
      if (!this.physicWorld.isPaused){
        this.body.update();
        this.updateRaycastVehicle();
        this.steeringControll(this.settings.steering.angle);
        this.updateLightHelper();
        for ( const wheel of Object.values(this.wheels)){
            wheel.updateBodyInfo();
            wheel.update();
        }
        this.updateRearLights();
      }
    }
    updateRaycastVehicle(){
      for (let i=0;i<this.raycastVehicle.wheelInfos.length;i++){
        this.raycastVehicle.updateWheelTransform(i);
      }
    }

    changeHeadlightsTargetX(x){
      this.body.headLights.LF.target.position.x = x;
      this.body.headLights.RF.target.position.x = x;
    }
    changeHeadlightsTargetZ(z){
      this.body.headLights.LF.target.position.z = z;
      this.body.headLights.RF.target.position.z = z;
    }
    changeHeadlightsDistance(d){
      this.body.headLights.LF.distance = d;
      this.body.headLights.RF.distance = d;
    }
    changeHeadlightsAngle(a){
      this.body.headLights.LF.angle = a;
      this.body.headLights.RF.angle = a;
    }
    changeHeadlightsIntensity(i){
      this.body.headLights.LF.intensity = i;
      this.body.headLights.RF.intensity = i;
    }
    changeHeadlightsPenumbra(p){
      this.body.headLights.LF.penumbra = p;
      this.body.headLights.RF.penumbra = p;
    }
    changeClearense(c){
      this.raycastVehicle.wheelInfos[0].chassisConnectionPointLocal.z = this.connectionPointsWheels.LF.z - c;
      this.raycastVehicle.wheelInfos[1].chassisConnectionPointLocal.z = this.connectionPointsWheels.RF.z - c;
      this.raycastVehicle.wheelInfos[2].chassisConnectionPointLocal.z = this.connectionPointsWheels.LR.z - c;
      this.raycastVehicle.wheelInfos[3].chassisConnectionPointLocal.z = this.connectionPointsWheels.RR.z - c;
    }
    changeCompression(dC){
      for (let i=0;i<this.raycastVehicle.wheelInfos.length;i++){
        this.raycastVehicle.wheelInfos[i].dampingCompression = dC;
      }
    }
    changeRelaxation(dR){
      for (let i=0;i<this.raycastVehicle.wheelInfos.length;i++){
        this.raycastVehicle.wheelInfos[i].dampingRelaxation = dR;
      }
    }

    changeMaterialBodyEI(i){
      this.materials.body.emissiveIntensity = i;
    }
    changeMaterialBodyEnvI(i){
      this.materials.body.envMapIntensity = i;
    }
    changeMaterialBodyMetalness(m){
      this.materials.body.metalness = m;
    }
    changeMaterialBodyRoughness(r){
      this.materials.body.roughness = r;
    }
    changeMaterialBodyEmissiveColor(color){
      this.materials.body.emissive.setHex(color);
    }
    changeMaterialBodyColor(color){
      this.materials.body.color.setHex(color);
    }

    changeMaterialRimEI(i){
      this.materials.rim.LF.emissiveIntensity = i;
      this.materials.rim.RF.emissiveIntensity = i;
      this.materials.rim.LR.emissiveIntensity = i;
      this.materials.rim.RR.emissiveIntensity = i;
    }
    changeMaterialRimEnvI(i){
      this.materials.rim.LF.envMapIntensity = i;
      this.materials.rim.RF.envMapIntensity = i;
      this.materials.rim.LR.envMapIntensity = i;
      this.materials.rim.RR.envMapIntensity = i;
    }
    changeMaterialRimMetalness(m){
      this.materials.rim.LF.metalness = m;
      this.materials.rim.RF.metalness = m;
      this.materials.rim.LR.metalness = m;
      this.materials.rim.RR.metalness = m;
    }
    changeMaterialRimRoughness(r){
      this.materials.rim.LF.roughness = r;
      this.materials.rim.RF.roughness = r;
      this.materials.rim.LR.roughness = r;
      this.materials.rim.RR.roughness = r;
    }
    changeMaterialRimEmissiveColor(color){
      this.materials.rim.LF.emissive.setHex(color);
      this.materials.rim.RF.emissive.setHex(color);
      this.materials.rim.LR.emissive.setHex(color);
      this.materials.rim.RR.emissive.setHex(color);
    }
    changeMaterialRimColor(color){
      this.materials.rim.LF.color.setHex(color);
      this.materials.rim.RF.color.setHex(color);
      this.materials.rim.LR.color.setHex(color);
      this.materials.rim.RR.color.setHex(color);
    }

    changeVisuPhysicMesh(){
      this.changeVisuPhysicBodyMesh();
      this.changeVisuPhysicWheelsMesh();
    }
    changeVisuPhysicBodyMesh(){
      this.body.graphic.physicMesh.visible = !this.body.graphic.physicMesh.visible;
    }
    changeVisuPhysicWheelsMesh(){
      for ( const wheel of Object.values(this.wheels)){
        wheel.graphic.physicMesh.visible = !wheel.graphic.physicMesh.visible;
      }
    }
    calculateRealDim(){
      return {
          body: {
              x: this.mainDim.body.x * this.mainDim.scaleOriginal,
              y: this.mainDim.body.y * this.mainDim.scaleOriginal,
              z: this.mainDim.body.z * this.mainDim.scaleOriginal,
            },
            wheel:{
              x: this.mainDim.wheel.x * this.mainDim.scaleOriginal,
              y: this.mainDim.wheel.y * this.mainDim.scaleOriginal,
              z: this.mainDim.wheel.z * this.mainDim.scaleOriginal,
            },
      };
    }
}
export { Vehicle };