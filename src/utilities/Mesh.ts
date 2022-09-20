import Camera from "../components/Camera";
import { Sphere } from "./math/Math";
import Transform from "./Transform";
import Triangle from "./Triangle";
import Vector3 from "./math/Vector3";
import Renderer from "../classes/Renderer";

export default class Mesh {
    triangles: Array<Triangle>;
    boundingSphere!: Sphere;

    constructor(triangles: Array<Triangle>) {
        this.triangles = triangles;
    }

    getVertices() {
        let vertices: Array<Vector3> = [];
        this.triangles.forEach((t) => {
            vertices.push(...t.vertices);
        });
        return vertices;
    }

    calculateBoundingSphere() {
        const vertices = this.getVertices();
        const center = vertices
            .reduce((pV: Vector3, cV: Vector3) => cV.add(pV))
            .multiply(1 / vertices.length);
        let radius = 0;
        vertices.forEach((v) => {
            const x = center.subtract(v).squareLength();
            if (x > radius) {
                radius = x;
            }
        });
        radius = Math.sqrt(radius);
        this.boundingSphere = { center, radius };
    }

    copy() {
        return new Mesh(this.triangles.map((t) => t.copy()));
    }

    transform(camera: Camera, transform: Transform) {
        const copy = this.copy();
        copy.triangles = copy.triangles.map((t) =>
            t.transform(camera, transform)
        );
        copy.calculateBoundingSphere();
        return copy;
    }

    project(camera: Camera, renderer: Renderer) {
        const copy = this.copy();
        copy.triangles = copy.triangles.map((t) => t.project(camera, renderer));
        return copy;
    }
}
