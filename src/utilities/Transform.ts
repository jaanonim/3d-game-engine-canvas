import Quaternion from "./Quaternion";
import Vector3 from "./Vector3";

export default class Transform {
    parent: Transform | undefined;
    scale: Vector3;
    position: Vector3;
    rotation: Quaternion;

    public get globalRotation(): Quaternion {
        if (this.parent == undefined) return this.rotation;
        return this.rotation.multiply(this.parent.globalRotation) as Quaternion;
    }

    public get globalScale(): Vector3 {
        if (this.parent == undefined) return this.scale;
        return this.scale.multiply(this.parent.globalScale);
    }

    public get globalPosition(): Vector3 {
        if (this.parent == undefined) return this.position;
        return this.parent.apply(this.position);
    }

    constructor(
        position: Vector3 = Vector3.zero,
        rotation: Quaternion = new Quaternion(),
        scale: Vector3 = Vector3.one,
        parent?: Transform
    ) {
        this.scale = scale;
        this.rotation = rotation;
        this.position = position;
        this.parent = parent || undefined;
    }

    apply(vector: Vector3) {
        return this.moveVector(this.rotateVector(this.scaleVector(vector)));
    }

    invert() {
        return new Transform(
            this.position.invert(),
            this.rotation.invert(),
            this.scale.invert(),
            this.parent
        );
    }

    scaleVector(vector: Vector3) {
        return vector.multiply(this.globalScale);
    }

    rotateVector(vector: Vector3) {
        return this.globalRotation.multiply(vector) as Vector3;
    }

    moveVector(vector: Vector3) {
        return vector.add(this.globalPosition);
    }
}
