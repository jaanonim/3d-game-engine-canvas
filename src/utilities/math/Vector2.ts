import Vector3 from "./Vector3";

export default class Vector2 {
    x: number;
    y: number;

    static zero: Vector2 = new Vector2(0, 0);
    static up: Vector2 = new Vector2(0, 1);
    static down: Vector2 = new Vector2(0, -1);
    static left: Vector2 = new Vector2(-1, 0);
    static right: Vector2 = new Vector2(1, 0);
    static one: Vector2 = new Vector2(1, 1);

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    add(vector: Vector2) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector2) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    multiply(v: Vector2 | number) {
        if (v instanceof Vector2) {
            return new Vector2(this.x * v.x, this.y * v.y);
        } else {
            return new Vector2(this.x * v, this.y * v);
        }
    }

    divide(v: Vector2 | number) {
        if (v instanceof Vector2) {
            return new Vector2(this.x / v.x, this.y / v.y);
        } else {
            return new Vector2(this.x / v, this.y / v);
        }
    }

    squareLength() {
        return this.x * this.x + this.y * this.y;
    }

    length() {
        return Math.sqrt(this.squareLength());
    }

    normalize() {
        if (this.length() == 0) return Vector2.zero;
        return this.multiply(1 / this.length());
    }

    roundToInt() {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    toVector3() {
        return new Vector3(this.x, this.y, 0);
    }
}
