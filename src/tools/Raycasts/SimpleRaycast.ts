import Scene from "../../classes/Scene";
import MeshRenderer from "../../components/MeshRenderer";
import { Sphere } from "../../utilities/math/Math";
import Vector3 from "../../utilities/math/Vector3";
import Raycasts, { RaycastResult } from "./Raycast";

export default class SimpleRaycast implements Raycasts {
    scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Casts ray and check for collisions with bounding spheres of meshes on scene
     * @param position origin of ray
     * @param direction direction of ray
     * @param length length of ray
     * @returns Array of RaycastResult
     */
    getCollisions(
        position: Vector3,
        direction: Vector3,
        length: number = Infinity
    ) {
        direction = direction.normalize();
        const meshes = this.scene.getAllComponents<MeshRenderer>(MeshRenderer);

        const res: Array<RaycastResult> = [];
        meshes.forEach((m) => {
            const d = this.distanceToCollisionWithSphere(
                position,
                direction,
                m.transformedMesh.boundingSphere
            );
            if (d !== -1 && d <= length)
                res.push({
                    meshRenderer: m,
                    distance: d,
                });
        });
        return res.sort((a, b) => a.distance - b.distance);
    }

    private distanceToCollisionWithSphere(
        position: Vector3,
        direction: Vector3,
        sphere: Sphere
    ) {
        const e = sphere.center.subtract(position);
        const a = e.dotProduct(direction);

        const rSq = sphere.radius * sphere.radius;
        const bSq = e.squareLength() - a * a;
        const f = Math.sqrt(rSq - bSq);

        if (rSq - bSq < 0) return -1;
        else if (e.squareLength() < rSq) return a + f;
        else return a - f;
    }
}
