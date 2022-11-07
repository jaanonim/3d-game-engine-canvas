import { clamp } from "./Math";
import Vector3 from "./Vector3";

export default class Box {
    a: Vector3;
    b: Vector3;

    constructor(a: Vector3, b: Vector3) {
        this.a = a;
        this.b = b;
    }

    /**
     * Clamps given Vector3 to be inside box
     * @param v Vector3
     * @returns
     */
    clamp(v: Vector3) {
        return new Vector3(
            clamp(
                v.x,
                Math.min(this.a.x, this.b.x),
                Math.max(this.a.x, this.b.x)
            ),
            clamp(
                v.y,
                Math.min(this.a.y, this.b.y),
                Math.max(this.a.y, this.b.y)
            ),
            clamp(
                v.z,
                Math.min(this.a.z, this.b.z),
                Math.max(this.a.z, this.b.z)
            )
        );
    }
}
