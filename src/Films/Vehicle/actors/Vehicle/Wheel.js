import { GObject } from '../GObject';
import * as CANNON from 'cannon';
import * as THREE from 'three';

class Wheel extends GObject {
	constructor ( phW, dim, mass, name ) {
		super( phW );
		this.name = name;
		this.dim = dim;
		this.mass = mass;
		this.physicMeshMatrtial = new THREE.MeshBasicMaterial( {
			color: 'blue',
			wireframe: false,
			side: THREE.DoubleSide
		} );
		this.init();

		return this;
	}

	init() {
		this.createBody();
		this.graphic.physicMesh = this.createPhysicMesh();
		this.graphic.physicMesh.visible = false;
		this.addToPhysicWorld( this.physicBody );
		this.add( this.graphic.physicMesh );
	}

	updateBodyInfo() {
		const t = this.raycastVehicleWheel.worldTransform;
		this.physicBody.position.copy( t.position );
		this.physicBody.quaternion.copy( t.quaternion );
	}

	createBody() {
		const cylinderShape = new CANNON.Cylinder( this.dim.x / 2, this.dim.x / 2, this.dim.y, 24 );
		cylinderShape.drawData = {
			radius: this.dim.x / 2,
			height: this.dim.y,
			segments: 24
		};
		this.physicBody = new CANNON.Body( {
			mass: this.mass,
			material: this.physicWorld.wheelMaterial
		} );
		this.physicBody.name = `${ this.name } wheel`;
		this.physicBody.renderOrder = 2;
		this.physicBody.type = CANNON.Body.KINEMATIC;
		this.physicBody.collisionFilterGroup = 0;

		const q1 = new CANNON.Quaternion();
		q1.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), Math.PI / 2 );
		this.physicBody.addShape( cylinderShape, new CANNON.Vec3(), q1 );
	}
}

export { Wheel };
