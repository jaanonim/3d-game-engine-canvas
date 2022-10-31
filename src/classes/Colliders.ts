import BoxCollider from "../components/colliders/BoxCollider";
import Collider from "../components/colliders/Collider";
import SphereCollider from "../components/colliders/SphereCollider";
import Box from "../utilities/math/Box";

export default class Colliders {
    colliders: Array<Collider>;

    constructor() {
        this.colliders = [];
    }

    registerCollider(collider: Collider) {
        this.colliders.push(collider);
    }

    removeCollider(collider: Collider) {
        this.colliders.splice(this.colliders.indexOf(collider), 1);
    }

    checkCollision(a: Collider, b: Collider): boolean {
        if (a instanceof SphereCollider && b instanceof SphereCollider)
            return this.sphereToSphere(a, b);

        if (a instanceof BoxCollider && b instanceof SphereCollider)
            return this.sphereToBox(b, a);
        if (a instanceof SphereCollider && b instanceof BoxCollider)
            return this.sphereToBox(a, b);

        return false;
    }

    sphereToSphere(a: SphereCollider, b: SphereCollider): boolean {
        const distSq = a.globalPosition
            .subtract(b.globalPosition)
            .squareLength();
        const rad = a.globalRadius + b.globalRadius;
        return distSq < rad * rad;
    }

    sphereToBox(a: SphereCollider, b: BoxCollider): boolean {
        const box = new Box(b.globalA, b.globalB);
        const c = box.clamp(a.globalPosition);
        const distSq = a.globalPosition.subtract(c).squareLength();
        return distSq < a.globalRadius * a.globalRadius;
    }
}
