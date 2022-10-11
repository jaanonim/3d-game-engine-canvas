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

    intersection(a: Vector3, b: Vector3, t: number) {
        return a.subtract(b).multiply(t).add(a);
    }

    computeT(a: Vector3, b: Vector3) {
        return (
            (-this.d - a.dotProduct(this.normal)) /
            a.subtract(b).dotProduct(this.normal)
        );
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
        } else if (d0 >= 0 && d1 < 0 && d2 < 0) {
            const t10 = this.computeT(t.vertices[1], t.vertices[0]);
            const t20 = this.computeT(t.vertices[2], t.vertices[0]);

            return [
                new Triangle(
                    [
                        t.vertices[0],
                        this.intersection(t.vertices[1], t.vertices[0], t10),
                        this.intersection(t.vertices[2], t.vertices[0], t20),
                    ],
                    [
                        t.verticesUvs[0],
                        this.intersection(
                            t.verticesUvs[1],
                            t.verticesUvs[0],
                            t10
                        ),
                        this.intersection(
                            t.verticesUvs[2],
                            t.verticesUvs[0],
                            t20
                        ),
                    ],
                    [
                        t.verticesNormals[0],
                        this.intersection(
                            t.verticesNormals[1],
                            t.verticesNormals[0],
                            t10
                        ),
                        this.intersection(
                            t.verticesNormals[2],
                            t.verticesNormals[0],
                            t20
                        ),
                    ],
                    t.normal,
                    t.hidden
                ),
            ];
        } else if (d0 < 0 && d1 >= 0 && d2 < 0) {
            const t01 = this.computeT(t.vertices[0], t.vertices[1]);
            const t21 = this.computeT(t.vertices[2], t.vertices[1]);

            return [
                new Triangle(
                    [
                        this.intersection(t.vertices[0], t.vertices[1], t01),
                        t.vertices[1],
                        this.intersection(t.vertices[2], t.vertices[1], t21),
                    ],
                    [
                        this.intersection(
                            t.verticesUvs[0],
                            t.verticesUvs[1],
                            t01
                        ),
                        t.verticesUvs[1],
                        this.intersection(
                            t.verticesUvs[2],
                            t.verticesUvs[1],
                            t21
                        ),
                    ],
                    [
                        this.intersection(
                            t.verticesNormals[0],
                            t.verticesNormals[1],
                            t01
                        ),
                        t.verticesNormals[1],
                        this.intersection(
                            t.verticesNormals[2],
                            t.verticesNormals[1],
                            t21
                        ),
                    ],
                    t.normal,
                    t.hidden
                ),
            ];
        } else if (d0 < 0 && d1 < 0 && d2 >= 0) {
            const t02 = this.computeT(t.vertices[0], t.vertices[2]);
            const t12 = this.computeT(t.vertices[1], t.vertices[2]);

            return [
                new Triangle(
                    [
                        this.intersection(t.vertices[0], t.vertices[2], t02),
                        this.intersection(t.vertices[1], t.vertices[2], t12),
                        t.vertices[2],
                    ],
                    [
                        this.intersection(
                            t.verticesUvs[0],
                            t.verticesUvs[2],
                            t02
                        ),
                        this.intersection(
                            t.verticesUvs[1],
                            t.verticesUvs[2],
                            t12
                        ),
                        t.verticesUvs[2],
                    ],
                    [
                        this.intersection(
                            t.verticesNormals[0],
                            t.verticesNormals[2],
                            t02
                        ),
                        this.intersection(
                            t.verticesNormals[1],
                            t.verticesNormals[2],
                            t12
                        ),
                        t.verticesNormals[2],
                    ],
                    t.normal,
                    t.hidden
                ),
            ];
        } else if (d0 >= 0 && d1 >= 0 && d2 < 0) {
            const t02 = this.computeT(t.vertices[0], t.vertices[2]);
            const t12 = this.computeT(t.vertices[1], t.vertices[2]);
            const v02 = this.intersection(t.vertices[0], t.vertices[2], t02);
            const v12 = this.intersection(t.vertices[1], t.vertices[2], t12);
            const u02 = this.intersection(
                t.verticesUvs[0],
                t.verticesUvs[2],
                t02
            );
            const u12 = this.intersection(
                t.verticesUvs[1],
                t.verticesUvs[2],
                t12
            );
            const n02 = this.intersection(
                t.verticesNormals[0],
                t.verticesNormals[2],
                t02
            );
            const n12 = this.intersection(
                t.verticesNormals[1],
                t.verticesNormals[2],
                t12
            );

            return [
                new Triangle(
                    [t.vertices[0], t.vertices[1], v02],
                    [t.verticesUvs[0], t.verticesUvs[1], u02],
                    [t.verticesNormals[0], t.verticesNormals[1], n02],
                    t.normal,
                    t.hidden
                ),
                new Triangle(
                    [t.vertices[1], v02, v12],
                    [t.verticesUvs[1], u02, u12],
                    [t.verticesNormals[1], n02, n12],
                    t.normal,
                    t.hidden
                ),
            ];
        } else if (d0 >= 0 && d1 < 0 && d2 >= 0) {
            const t01 = this.computeT(t.vertices[0], t.vertices[1]);
            const t12 = this.computeT(t.vertices[1], t.vertices[2]);
            const v01 = this.intersection(t.vertices[0], t.vertices[1], t01);
            const v12 = this.intersection(t.vertices[1], t.vertices[2], t12);
            const u01 = this.intersection(
                t.verticesUvs[0],
                t.verticesUvs[1],
                t01
            );
            const u12 = this.intersection(
                t.verticesUvs[1],
                t.verticesUvs[2],
                t12
            );
            const n01 = this.intersection(
                t.verticesNormals[0],
                t.verticesNormals[1],
                t01
            );
            const n12 = this.intersection(
                t.verticesNormals[1],
                t.verticesNormals[2],
                t12
            );

            return [
                new Triangle(
                    [t.vertices[0], t.vertices[2], v01],
                    [t.verticesUvs[0], t.verticesUvs[2], u01],
                    [t.verticesNormals[0], t.verticesNormals[2], n01],
                    t.normal,
                    t.hidden
                ),
                new Triangle(
                    [t.vertices[2], v01, v12],
                    [t.verticesUvs[2], u01, u12],
                    [t.verticesNormals[2], n01, n12],
                    t.normal,
                    t.hidden
                ),
            ];
        } else if (d0 < 0 && d1 >= 0 && d2 >= 0) {
            const t01 = this.computeT(t.vertices[0], t.vertices[1]);
            const t02 = this.computeT(t.vertices[0], t.vertices[2]);
            const v01 = this.intersection(t.vertices[0], t.vertices[1], t01);
            const v02 = this.intersection(t.vertices[0], t.vertices[2], t02);
            const u01 = this.intersection(
                t.verticesUvs[0],
                t.verticesUvs[1],
                t01
            );
            const u02 = this.intersection(
                t.verticesUvs[0],
                t.verticesUvs[2],
                t02
            );
            const n01 = this.intersection(
                t.verticesNormals[0],
                t.verticesNormals[1],
                t01
            );
            const n02 = this.intersection(
                t.verticesNormals[0],
                t.verticesNormals[2],
                t02
            );

            return [
                new Triangle(
                    [t.vertices[1], t.vertices[2], v01],
                    [t.verticesUvs[1], t.verticesUvs[2], u01],
                    [t.verticesNormals[1], t.verticesNormals[2], n01],
                    t.normal,
                    t.hidden
                ),
                new Triangle(
                    [t.vertices[2], v01, v02],
                    [t.verticesUvs[2], u01, u02],
                    [t.verticesNormals[2], n01, n02],
                    t.normal,
                    t.hidden
                ),
            ];
        } else {
            console.error(d0, d1, d2);
            throw new Error("Something went wrong in ClippingPlanes");
        }
    }
}
