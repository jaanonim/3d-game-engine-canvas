import { clamp } from "./Math";
import Vector3 from "./Vector3";

export default class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static euler(vector: Vector3) {
        const c1 = Math.cos(vector.x / 2);
        const c2 = Math.cos(vector.y / 2);
        const c3 = Math.cos(vector.z / 2);

        const s1 = Math.sin(vector.x / 2);
        const s2 = Math.sin(vector.y / 2);
        const s3 = Math.sin(vector.z / 2);

        return new Quaternion(
            s1 * c2 * c3 + c1 * s2 * s3,
            c1 * s2 * c3 - s1 * c2 * s3,
            c1 * c2 * s3 + s1 * s2 * c3,
            c1 * c2 * c3 - s1 * s2 * s3
        );
    }

    copy() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    multiply(v: Vector3): Vector3;
    multiply(v: Quaternion): Quaternion;
    multiply(v: Vector3 | Quaternion) {
        if (v instanceof Vector3) {
            const ix = this.w * v.x + this.y * v.z - this.z * v.y;
            const iy = this.w * v.y + this.z * v.x - this.x * v.z;
            const iz = this.w * v.z + this.x * v.y - this.y * v.x;
            const iw = -this.x * v.x - this.y * v.y - this.z * v.z;

            return new Vector3(
                ix * this.w + iw * -this.x + iy * -this.z - iz * -this.y,
                iy * this.w + iw * -this.y + iz * -this.x - ix * -this.z,
                iz * this.w + iw * -this.z + ix * -this.y - iy * -this.x
            );
        } else {
            return new Quaternion(
                this.x * v.w + this.w * v.x + this.y * v.z - this.z * v.y,
                this.y * v.w + this.w * v.y + this.z * v.x - this.x * v.z,
                this.z * v.w + this.w * v.z + this.x * v.y - this.y * v.x,
                this.w * v.w - this.x * v.x - this.y * v.y - this.z * v.z
            );
        }
    }

    invert() {
        return new Quaternion(-this.x, -this.y, -this.z, this.w);
    }

    normalize() {
        let len = this.length();
        if (len === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        } else {
            len = 1 / len;

            this.x = this.x * len;
            this.y = this.y * len;
            this.z = this.z * len;
            this.w = this.w * len;
        }
        return this.copy();
    }

    squareLength() {
        return (
            this.x * this.x +
            this.y * this.y +
            this.z * this.z +
            this.w * this.w
        );
    }

    dotProduct(q: Quaternion) {
        return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
    }

    length() {
        return Math.sqrt(this.squareLength());
    }

    angleTo(q: Quaternion) {
        return 2 * Math.acos(Math.abs(clamp(this.dotProduct(q), -1, 1)));
    }

    slerp(q: Quaternion, t: number) {
        if (t === 0) return this;
        if (t === 1) return q.copy();

        const x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;

        let cosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;

        if (cosHalfTheta < 0) {
            this.w = -q.w;
            this.x = -q.x;
            this.y = -q.y;
            this.z = -q.z;

            cosHalfTheta = -cosHalfTheta;
        } else {
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
            this.w = q.w;
        }

        if (cosHalfTheta >= 1.0) {
            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;

            return this.copy();
        }

        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= Number.EPSILON) {
            const s = 1 - t;
            this.w = s * w + t * this.w;
            this.x = s * x + t * this.x;
            this.y = s * y + t * this.y;
            this.z = s * z + t * this.z;

            this.normalize();

            return this.copy();
        }

        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        this.w = w * ratioA + this.w * ratioB;
        this.x = x * ratioA + this.x * ratioB;
        this.y = y * ratioA + this.y * ratioB;
        this.z = z * ratioA + this.z * ratioB;

        return this.copy();
    }
}
