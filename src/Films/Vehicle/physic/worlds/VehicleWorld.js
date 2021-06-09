import * as CANNON from "cannon";

class VehicleWorld {
    constructor(world){
        this.world = world;
        this.isPaused = false;
        this.init();
    }
    init(){
        this.world.gravity.set(0,-9.81,0);
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.world.solver.iterations = 15;
        this.addContactMaterials(this.world);
    }
    addContactMaterials(world){
        world.defaultContactMaterial.friction = 0;

        this.groundMaterial = new CANNON.Material("groundMaterial");
        this.wheelMaterial = new CANNON.Material("wheelMaterial");
        this.coneMaterial = new CANNON.Material("coneMaterial");
        this.ground_wheelContactMaterial = new CANNON.ContactMaterial(this.wheelMaterial, this.groundMaterial, {
          friction: 0.4,
          restitution: 0.3,
          contactEquationStiffness: 1e8,
          contactEquationRelaxation: 3,
          frictionEquationStiffness: 1e8,
          frictionEquationRegularizationTime: 3,
        });
        this.ground_coneContactMaterial = new CANNON.ContactMaterial(this.coneMaterial, this.groundMaterial, {
          friction: 0.4,
          restitution: 0.3,
          contactEquationStiffness: 1e8,
          contactEquationRelaxation: 3
          //contactEquationStiffness: 1000
        });
        world.addContactMaterial(this.ground_wheelContactMaterial);
        world.addContactMaterial(this.ground_coneContactMaterial);
    }
    update(){}

}

export { VehicleWorld };