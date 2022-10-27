import { clamp } from "./Math";
import Vector2 from "./Vector2";

export default class Box2D {
    a: Vector2;
    b: Vector2;

    constructor(a: Vector2, b: Vector2) {
        this.a = a;
        this.b = b;
    }

    clamp(v: Vector2) {
        return new Vector2(
            clamp(
                v.x,
                Math.min(this.a.x, this.b.x),
                Math.max(this.a.x, this.b.x)
            ),
            clamp(
                v.y,
                Math.min(this.a.y, this.b.y),
                Math.max(this.a.y, this.b.y)
            )
        );
    }

    contains(v: Vector2): boolean {
        return (
            v.x >= Math.min(this.a.x, this.b.x) &&
            v.x <= Math.max(this.a.x, this.b.x) &&
            v.y >= Math.min(this.a.y, this.b.y) &&
            v.y <= Math.max(this.a.y, this.b.y)
        );
    }

    size() {
        return this.b.subtract(this.a);
    }
}
