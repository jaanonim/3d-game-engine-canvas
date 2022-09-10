import Vector3 from "./Vector3";

export default class ClippingPlane {
    normal: Vector3;
    d: number;

    constructor(normal: Vector3, d: number) {
        this.normal = normal;
        this.d = d;
    }

    distance(v: Vector3) {
        return (
            v.x * this.normal.x +
            v.y * this.normal.y +
            v.z * this.normal.z +
            this.d
        );
    }
}
