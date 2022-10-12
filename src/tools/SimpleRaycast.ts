import Scene from "../classes/Scene";
import MeshRenderer from "../components/MeshRenderer";
import { Sphere } from "../utilities/math/Math";
import Vector3 from "../utilities/math/Vector3";

export default class SimpleRaycast {
    position: Vector3;
    direction: Vector3;
    length: number;

    constructor(position: Vector3, direction: Vector3, length: number) {
        this.position = position;
        this.direction = direction;
        this.length = length;
    }

    getCollisions(scene: Scene) {
        const meshes = scene
            .getAllComponents<MeshRenderer>(MeshRenderer)
            .map((m) => m.transformedMesh);
        return meshes.filter(
            (m) => this.distanceToCollisionWithSphere(m.boundingSphere) !== -1
        );
    }

    distanceToCollisionWithSphere(sphere: Sphere) {
        const e = sphere.center.subtract(this.position);
        const a = e.dotProduct(this.direction);

        const rSq = sphere.radius * sphere.radius;
        const bSq = e.squareLength() - a * a;
        const f = Math.sqrt(rSq - bSq);

        if (rSq - bSq < 0) return -1;
        else if (e.squareLength() < rSq) return a + f;
        else return a - f;
    }
}
