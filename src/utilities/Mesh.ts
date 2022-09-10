import Camera from "../classes/Camera";
import { Sphere } from "./Math";
import Transform from "./Transform";
import Triangle from "./Triangle";
import Vector3 from "./Vector3";

export default class Mesh {
    vertices: Array<Vector3>;
    triangles: Array<[number, number, number]>;
    boundingSphere!: Sphere;

    constructor(
        vertices: Array<Vector3>,
        triangles: Array<[number, number, number]>
    ) {
        this.triangles = triangles;
        this.vertices = vertices;
    }

    calculateBoundingSphere() {
        const center = this.vertices
            .reduce((pV: Vector3, cV: Vector3) => cV.add(pV))
            .multiply(1 / this.vertices.length);
        let radius = 0;
        this.vertices.forEach((v) => {
            const x = center.add(v.invert()).squareLength();
            if (x > radius) {
                radius = x;
            }
        });
        radius = Math.sqrt(radius);
        this.boundingSphere = { center, radius };
    }

    verify() {
        try {
            this.triangles.forEach((t) => {
                if (t.length !== 3) throw Error();
                t.forEach((x) => {
                    if (x < 0 || x >= this.vertices.length) throw Error();
                });
            });
        } catch (e) {
            return false;
        }
        return true;
    }

    copy() {
        return new Mesh(this.vertices, this.triangles);
    }

    project(camera: Camera, transform: Transform) {
        const copy = this.copy();
        copy.vertices = copy.vertices.map((v) =>
            camera.transformToCamera(transform.apply(v))
        );
        copy.calculateBoundingSphere();
        return copy;
    }

    toArrayOfTriangles() {
        return this.triangles.map(
            (t) =>
                new Triangle(
                    t.map((i) => this.vertices[i]) as [
                        Vector3,
                        Vector3,
                        Vector3
                    ]
                )
        );
    }
}
