export default class Vector3 {
    x: number;
    y: number;
    z: number;

    static zero: Vector3 = new Vector3(0, 0, 0);
    static up: Vector3 = new Vector3(0, 1, 0);
    static forward: Vector3 = new Vector3(0, 0, 1);
    static one: Vector3 = new Vector3(1, 1, 1);

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    add(vector: Vector3) {
        return new Vector3(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z
        );
    }

    multiply(v: Vector3 | number) {
        if (v instanceof Vector3) {
            return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
        } else {
            return new Vector3(this.x * v, this.y * v, this.z * v);
        }
    }

    invert() {
        return this.multiply(-1);
    }

    normalize() {
        return this.multiply(1 / this.length());
    }

    length() {
        return Math.sqrt(this.squareLength());
    }

    squareLength() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
}
