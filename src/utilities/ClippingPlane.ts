import { Sphere } from "./math/Math";
import Triangle from "./Triangle";
import Vector3 from "./math/Vector3";

export type ClipResult = -1 | 0 | 1;

export default class ClippingPlane {
    normal: Vector3;
    d: number;

    constructor(normal: Vector3 = Vector3.zero, d: number = 0) {
        this.normal = normal;
        this.d = d;
    }

    distance(v: Vector3) {
        return v.dotProduct(this.normal) + this.d;
    }

    intersection(a: Vector3, b: Vector3) {
        const ab = a.subtract(b);
        return ab
            .multiply(
                (-this.d - a.dotProduct(this.normal)) /
                    ab.dotProduct(this.normal)
            )
            .add(a);
    }

    preClipObject(boundingSphere: Sphere): ClipResult {
        const d = this.distance(boundingSphere.center);
        if (boundingSphere.radius < d) {
            return 1;
        } else if (-boundingSphere.radius > d) {
            return -1;
        } else {
            return 0;
        }
    }

    clipTriangles(triangles: Array<Triangle>) {
        const resTriangles: Triangle[] = [];
        triangles.forEach((t) => {
            resTriangles.push(...this.clipTriangle(t));
        });
        return resTriangles;
    }

    clipTriangle(t: Triangle) {
        const d0 = this.distance(t.vertices[0]);
        const d1 = this.distance(t.vertices[1]);
        const d2 = this.distance(t.vertices[2]);

        if (d0 >= 0 && d1 >= 0 && d2 >= 0) {
            return [t];
        } else if (d0 <= 0 && d1 <= 0 && d2 <= 0) {
            return [];
        } else if (d0 > 0 && d1 < 0 && d2 < 0) {
            return [
                new Triangle(
                    [
                        t.vertices[0],
                        this.intersection(t.vertices[1], t.vertices[0]),
                        this.intersection(t.vertices[2], t.vertices[0]),
                    ],
                    t.normal,
                    t.verticesNormals
                ),
            ];
        } else if (d0 < 0 && d1 > 0 && d2 < 0) {
            return [
                new Triangle(
                    [
                        this.intersection(t.vertices[0], t.vertices[1]),
                        t.vertices[1],
                        this.intersection(t.vertices[2], t.vertices[1]),
                    ],
                    t.normal,
                    t.verticesNormals
                ),
            ];
        } else if (d0 < 0 && d1 < 0 && d2 > 0) {
            return [
                new Triangle(
                    [
                        this.intersection(t.vertices[0], t.vertices[2]),
                        this.intersection(t.vertices[1], t.vertices[2]),
                        t.vertices[2],
                    ],
                    t.normal,
                    t.verticesNormals
                ),
            ];
        } else if (d0 > 0 && d1 > 0 && d2 < 0) {
            const _02 = this.intersection(t.vertices[0], t.vertices[2]);
            const _12 = this.intersection(t.vertices[1], t.vertices[2]);
            return [
                new Triangle(
                    [t.vertices[0], t.vertices[1], _02],
                    t.normal,
                    t.verticesNormals
                ),
                new Triangle(
                    [t.vertices[1], _02, _12],
                    t.normal,
                    t.verticesNormals
                ),
            ];
        } else if (d0 > 0 && d1 < 0 && d2 > 0) {
            const _01 = this.intersection(t.vertices[0], t.vertices[1]);
            const _12 = this.intersection(t.vertices[1], t.vertices[2]);
            return [
                new Triangle(
                    [t.vertices[0], t.vertices[2], _01],
                    t.normal,
                    t.verticesNormals
                ),
                new Triangle(
                    [t.vertices[2], _01, _12],
                    t.normal,
                    t.verticesNormals
                ),
            ];
        } else if (d0 < 0 && d1 > 0 && d2 > 0) {
            const _01 = this.intersection(t.vertices[0], t.vertices[1]);
            const _02 = this.intersection(t.vertices[0], t.vertices[2]);
            return [
                new Triangle(
                    [t.vertices[1], t.vertices[2], _01],
                    t.normal,
                    t.verticesNormals
                ),
                new Triangle(
                    [t.vertices[2], _01, _02],
                    t.normal,
                    t.verticesNormals
                ),
            ];
        } else {
            throw new Error("Something went wrong in ClippingPlanes");
        }
    }
}
