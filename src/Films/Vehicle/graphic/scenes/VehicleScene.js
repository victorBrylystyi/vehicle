import * as THREE from "three";
import { Ground } from "../../actors/Ground";
import { Vehicle } from "../../actors/Vehicle/Vehicle";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class VehicleScene {
    constructor(canvas,physicWorld){
        this.name = 'vehicle scene';
        this.assetes = null;
        this.canvas = canvas;
        this.physicWorld = physicWorld;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 1, 3000 );
        this.settings = {
            sceneLightBias : 0,
            controlsMaxDist : 45,
            controlsMaxAngle : 1.45,
        };
        this.init();
        return this;
    }
    init(){
        this.camera.position.x = 50;
        this.camera.position.y = 20;

        this.controls = new OrbitControls(this.camera,this.canvas);
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;

        this.amb = new THREE.AmbientLight('white',0.3);
        this.scene.add(this.amb);
  
        this.controls.minDistance = 22;
        this.controls.maxDistance = this.settings.controlsMaxDist;

        this.controls.maxPolarAngle = this.settings.controlsMaxAngle;
        
        this.scene.background =  new THREE.Color(0xeeeeee);

        const near = 20;
        const far = 300;
        this.fog = new THREE.Fog(this.scene.background, near, far);

        this.addSceneLight();

        this.vehicle = new Vehicle(this.physicWorld,this.controls);

        this.ground = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 0.1,
            elementSize: 5,
        },new THREE.Vector3(-250, 0, 250));

        this.ground2 = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 3,
            elementSize: 5,
        },new THREE.Vector3(-745, 0, 250));

        this.ground3 = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 1,
            elementSize: 5,
        },new THREE.Vector3(245, 0, 250));

        this.ground4 = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 0.1,
            elementSize: 5,
        },new THREE.Vector3(245, 0, 745));

        this.ground5 = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 2,
            elementSize: 5,
        },new THREE.Vector3(245, 0, -245));

        this.ground6 = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 3,
            elementSize: 5,
        },new THREE.Vector3(-250, 0, -245));

        this.ground7 = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 1,
            elementSize: 5,
        },new THREE.Vector3(-250, 0, 745));

        this.ground8 = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 2,
            elementSize: 5,
        },new THREE.Vector3(-745, 0, 745));

        this.ground9 = new Ground(this.physicWorld,{
            sizeX: 100,
            sizeY: 100,
            heightPlane: 10,
            amplitude: 5,
            elementSize: 5,
        },new THREE.Vector3(-745, 0, -245));

        this.prepare = {
            vehicle: (model)=>{
                console.log(model);
                model.scene.traverse((child)=>{
                    if ( ! child.isMesh ) return;
                    let prevMaterial = child.material;
                    child.material = new THREE.MeshPhysicalMaterial();
                    THREE.MeshStandardMaterial.prototype.copy.call(child.material,prevMaterial);
                });
                const body = this.foundMeshByName('body',model.scene.children);
                this.vehicle.materials.body = this.foundMaterialInGroupByName('testCarPaint', body);
                this.vehicle.materials.body.emissive.setHex(0xa29d9d);

                const lightLF = this.foundMeshByName('f_l_light',model.scene.children);
                const lightRF = this.foundMeshByName('f_r_light',model.scene.children);

                const lightRR = this.foundMeshByName('r_r_light',model.scene.children);
                const lightLR = this.foundMeshByName('r_l_light',model.scene.children);


                const matLightRF = this.foundMaterialInGroupByName("righTurnLight", lightRF);
                const matLightLF = this.foundMaterialInGroupByName("leftTurnLight", lightLF);

                //console.log(matLightRF);

                matLightLF.emissive.setHex(0x000000);
                matLightRF.emissive.setHex(0x000000);

                this.vehicle.materials.lights.LF = matLightLF;
                this.vehicle.materials.lights.RF = matLightRF;

                const matLightRR = this.foundMaterialInGroupByName("REAR TAIL LIGHT.002", lightRR);
                const matLightLR = this.foundMaterialInGroupByName("REAR TAIL LIGHT.002", lightLR);

                matLightLR.emissive.r = 0.35;
                matLightRR.emissive.r = 0.35;

                this.vehicle.materials.lights.LR = matLightLR;
                this.vehicle.materials.lights.RR = matLightRR;

                this.vehicle.body.add(
                    body,
                    lightLF,
                    lightLR,
                    lightRR,
                    lightRF,
                );
                this.vehicle.body.createHeadlights();
                this.vehicle.body.setLightsPositions();

                this.vehicle.wheels.RR.add(this.foundMeshByName('r_r_wheel',model.scene.children));
                this.vehicle.wheels.RF.add(this.foundMeshByName('f_r_wheel',model.scene.children));
                this.vehicle.wheels.LR.add(this.foundMeshByName('r_l_wheel',model.scene.children));
                this.vehicle.wheels.LF.add(this.foundMeshByName('f_l_wheel',model.scene.children));

                const wheel_RR = this.foundMeshByName('r_r_wheel',this.vehicle.wheels.RR.children);
                const wheel_RF = this.foundMeshByName('f_r_wheel',this.vehicle.wheels.RF.children);
                const wheel_LR = this.foundMeshByName('r_l_wheel',this.vehicle.wheels.LR.children);
                const wheel_LF = this.foundMeshByName('f_l_wheel',this.vehicle.wheels.LF.children);

                const carbonDiskLF = this.foundMaterialInGroupByName('carbon disk brake', wheel_LF);
                const carbonDiskRF = this.foundMaterialInGroupByName('carbon disk brake', wheel_RF);
                const carbonDiskLR = this.foundMaterialInGroupByName('carbon disk brake', wheel_LR);
                const carbonDiskRR = this.foundMaterialInGroupByName('carbon disk brake', wheel_RR);

                carbonDiskLF.envMapIntensity = 0.5;
                carbonDiskRF.envMapIntensity = 0.5;
                carbonDiskLR.envMapIntensity = 0.5;
                carbonDiskRR.envMapIntensity = 0.5;

                this.vehicle.materials.rim.LF = this.foundMaterialInGroupByName('frontDisk', wheel_LF);
                this.vehicle.materials.rim.RF = this.foundMaterialInGroupByName('frontDisk', wheel_RF);
                this.vehicle.materials.rim.LR = this.foundMaterialInGroupByName('frontDisk', wheel_LR);
                this.vehicle.materials.rim.RR = this.foundMaterialInGroupByName('frontDisk', wheel_RR);

                this.vehicle.materials.rim.LF.emissive.setHex(0x8c8c8c);
                this.vehicle.materials.rim.RF.emissive.setHex(0x8c8c8c);
                this.vehicle.materials.rim.LR.emissive.setHex(0x8c8c8c);
                this.vehicle.materials.rim.RR.emissive.setHex(0x8c8c8c);
                

                this.vehicle.body.name = 'body';
                this.vehicle.wheels.LF.name = 'LF';
                this.vehicle.wheels.RF.name = 'RF';
                this.vehicle.wheels.RR.name = 'RR';
                this.vehicle.wheels.LR.name = 'LR';

                console.log(this.vehicle);
                console.log(this.ground);

            },
            ground_color: (map)=>{
                this.ground.addMapToMatarial(map);
                this.ground2.addMapToMatarial(map);
                this.ground3.addMapToMatarial(map);
                this.ground4.addMapToMatarial(map);
                this.ground5.addMapToMatarial(map);
                this.ground6.addMapToMatarial(map);
                this.ground7.addMapToMatarial(map);
                this.ground8.addMapToMatarial(map);
                this.ground9.addMapToMatarial(map);
            },
            ground_ao: (map)=>{
                this.ground.addAOMapToMatarial(map);
                this.ground2.addAOMapToMatarial(map);
                this.ground3.addAOMapToMatarial(map);
                this.ground4.addAOMapToMatarial(map);
                this.ground5.addAOMapToMatarial(map);
                this.ground6.addAOMapToMatarial(map);
                this.ground7.addAOMapToMatarial(map);
                this.ground8.addAOMapToMatarial(map);
                this.ground9.addAOMapToMatarial(map);
            },
            ground_normal: (map)=>{
                this.ground.addNormalMapToMatarial(map);
                this.ground2.addNormalMapToMatarial(map);
                this.ground3.addNormalMapToMatarial(map);
                this.ground4.addNormalMapToMatarial(map);
                this.ground5.addNormalMapToMatarial(map);
                this.ground6.addNormalMapToMatarial(map);
                this.ground7.addNormalMapToMatarial(map);
                this.ground8.addNormalMapToMatarial(map);
                this.ground9.addNormalMapToMatarial(map);
            },
            ground_roughness: (map)=>{
                this.ground.addRoughnessMapToMatarial(map);
                this.ground2.addRoughnessMapToMatarial(map);
                this.ground3.addRoughnessMapToMatarial(map);
                this.ground4.addRoughnessMapToMatarial(map);
                this.ground5.addRoughnessMapToMatarial(map);
                this.ground6.addRoughnessMapToMatarial(map);
                this.ground7.addRoughnessMapToMatarial(map);
                this.ground8.addRoughnessMapToMatarial(map);
                this.ground9.addRoughnessMapToMatarial(map);
            },
            ground_displ: (map)=>{
                this.ground.addDisplMapToMatarial(map);
                this.ground2.addDisplMapToMatarial(map);
                this.ground3.addDisplMapToMatarial(map);
                this.ground4.addDisplMapToMatarial(map);
                this.ground5.addDisplMapToMatarial(map);
                this.ground6.addDisplMapToMatarial(map);
                this.ground7.addDisplMapToMatarial(map);
                this.ground8.addDisplMapToMatarial(map);
                this.ground9.addDisplMapToMatarial(map);
            },
        };
        this.gui = {
            changeSceneBackground: (colorHex) => {
                this.scene.background.setHex(colorHex);
                if (this.scene.fog) this.scene.fog.color.setHex(colorHex);
            },
            changeSceneLightIntensity: (v) => {
                this.sceneLight.intensity = v;
            },
            changeSceneLightColor: (colorHex) => {
                this.sceneLight.color.setHex(colorHex); 
            },
            changeSceneLightPosition: (position) => {
                this.settings.sceneLightBias = position; 
            },
            changeVehicleClearence: (c) => {
                this.vehicle.changeClearense(c);
            },
            changeVehicleCompression: (cmp) => {
                this.vehicle.changeCompression(cmp);
            },
            changeVehicleRelaxation: (rlx) => {
                this.vehicle.changeRelaxation(rlx);
            },
            changeVehicleHeadlightsDistance: (d)=>{
                this.vehicle.changeHeadlightsDistance(d);
            },
            changeVehicleHeadlightsTargetZ: (z)=>{
                this.vehicle.changeHeadlightsTargetZ(z);
            },
            changeVehicleHeadlightsTargetX: (x)=>{
                this.vehicle.changeHeadlightsTargetX(x);
            },
            changeVehicleHeadlightsAngle: (a)=>{
                this.vehicle.changeHeadlightsAngle(a);
            },
            changeVehicleHeadlightsIntensity: (i)=>{
                this.vehicle.changeHeadlightsIntensity(i);
            },
            changeVehicleHeadlightsPenumbra: (p)=>{
                this.vehicle.changeHeadlightsPenumbra(p);
            },

            changeVehicleMaterialBodyEI: (i)=>{
                this.vehicle.changeMaterialBodyEI(i);
            },
            changeVehicleMaterialBodyEnvI: (i)=>{
                this.vehicle.changeMaterialBodyEnvI(i);
            },
            changeVehicleMaterialBodyMetalness: (m)=>{
                this.vehicle.changeMaterialBodyMetalness(m);
            },
            changeVehicleMaterialBodyRoughness: (r)=>{
                this.vehicle.changeMaterialBodyRoughness(r);
            },
            changeVehicleMaterialBodyEmissiveColor: (color)=>{
                this.vehicle.changeMaterialBodyEmissiveColor(color);
            },
            changeVehicleMaterialBodyColor: (color)=>{
                this.vehicle.changeMaterialBodyColor(color);
            },

            changeVehicleMaterialRimEI: (i)=>{
                this.vehicle.changeMaterialRimEI(i);
            },
            changeVehicleMaterialRimEnvI: (i)=>{
                this.vehicle.changeMaterialRimEnvI(i);
            },
            changeVehicleMaterialRimMetalness: (m)=>{
                this.vehicle.changeMaterialRimMetalness(m);
            },
            changeVehicleMaterialRimRoughness: (r)=>{
                this.vehicle.changeMaterialRimRoughness(r);
            },
            changeVehicleMaterialRimEmissiveColor: (color)=>{
                this.vehicle.changeMaterialRimEmissiveColor(color);
            },
            changeVehicleMaterialRimColor: (color)=>{
                this.vehicle.changeMaterialRimColor(color);
            },

            changeVehicleFriction: (f)=>{
                this.vehicle.changeFrictionSlip(f);
            },
            changeVehicleMaxEngine: (e)=>{
                this.vehicle.changeMaxEngineForce(e);
            },
            changeVehicleMaxBrake: (b)=>{
                this.vehicle.changeMaxBrakeForce(b);
            },
            changeVehicleBodyHeadlightsVisu : (v)=>{
                this.vehicle.changeBodyHeadlightsVisible(v);
            },
            changeVehicleTypeDrive: (type)=>{
                this.vehicle.changeTypeDrive(type);
            },

        };

        this.scene.add(this.ground);
        this.scene.add(this.ground2);
        this.scene.add(this.ground3);
        this.scene.add(this.ground4);
        this.scene.add(this.ground5);
        this.scene.add(this.ground6);
        this.scene.add(this.ground7);
        this.scene.add(this.ground8);
        this.scene.add(this.ground9);

        this.scene.add(this.vehicle.body);
        this.scene.add(this.vehicle.wheels.LF);
        this.scene.add(this.vehicle.wheels.LR);
        this.scene.add(this.vehicle.wheels.RF);
        this.scene.add(this.vehicle.wheels.RR);
    }
    addAssets(data){
        switch (data.name){
            case "box":
                this.prepare.box(data.map);
            break;
            case "vehicleModel":
                this.prepare.vehicle(data.map);
            break;
            case "ground_color":
                this.prepare.ground_color(data.map);
            break;
            case "ground_ao":
                this.prepare.ground_ao(data.map);
            break;
            case "ground_normal":
                this.prepare.ground_normal(data.map);
            break;
            case "ground_roughness":
                this.prepare.ground_roughness(data.map);
            break;
            case "ground_displ":
                this.prepare.ground_displ(data.map);
            break;
            
        };
    }
    loadAllAssets(){

        for (let i=0;i<this.vehicle.body.children.length;i++){
            if (this.vehicle.body.children[i].type === "Group"){
                for (let k=0;k<this.vehicle.body.children[i].children.length;k++){
                    this.vehicle.body.children[i].children[k].material.envMap = this.assetes.get('v1');
                }
            }
        }
        for ( const wheel of Object.values(this.vehicle.wheels)){
            for (let i=0;i< wheel.children.length;i++){
                for (let k=0;k<wheel.children[i].children.length;k++){
                    wheel.children[i].children[k].material.envMap = this.assetes.get('v1');
                }
            }
        }
        
    }
    addFog(){
        this.fog.color = this.scene.background;
        this.scene.fog = this.fog;
    }
    removeFog(){
        this.scene.fog = null;
    }
    changeControlMaxDist(){
        this.controls.maxDistance = this.settings.controlsMaxDist;
    }
    changeControlMaxAngle(){
        this.controls.maxPolarAngle = this.settings.controlsMaxAngle;
    }
    addSceneLight(){
        this.sceneLight = new THREE.PointLight('white');
        this.sceneLightHelper  = new THREE.PointLightHelper(this.sceneLight);

        this.scene.add(this.sceneLight);
        //this.scene.add(this.sceneLightHelper);
    }
    resizeAction(){
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }
    updateScene(){
        this.updateSceneLight();
    }
    updateSceneLight(){
        this.sceneLight.position.x = this.vehicle.body.position.x;
        this.sceneLight.position.y = this.vehicle.body.position.y + 15 + this.settings.sceneLightBias;
        this.sceneLight.position.z = this.vehicle.body.position.z;
    }
    updateActors(){
        this.vehicle.update();
    }
    update(fi){
        this.updateActors();
        this.updateScene();
        this.controls.target.set(this.vehicle.body.position.x,this.vehicle.body.position.y,this.vehicle.body.position.z);
        this.controls.update();
    }
    foundMeshByName(name = '', source){
        for (let i=0;i<source.length;i++){
          if (source[i].name==name){
            return source[i];
          }
        }
    }
    foundMaterialInGroupByName(name = '', grp){
        let material = null;
        for (let i = 0; i < grp.children.length;i++){
            if (grp.children[i].isMesh){
                if (grp.children[i].material.name === name){
                    return grp.children[i].material;
                }
            }
        }
        return material;
    }
}

export { VehicleScene };