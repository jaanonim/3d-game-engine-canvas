import Camera from "../components/Camera";
import { Sphere } from "./math/Math";
import Transform from "./Transform";
import Triangle from "./Triangle";
import Vector3 from "./math/Vector3";

export default class Mesh {
    vertices: Array<Vector3>;
    triangles: Array<[number, number, number]>;
    normals: Array<Vector3>;
    verticesNormals: Array<Vector3>;
    boundingSphere!: Sphere;

    constructor(
        vertices: Array<Vector3>,
        triangles: Array<[number, number, number]>,
        normals?: Array<Vector3>,
        verticesNormals?: Array<Vector3>
    ) {
        this.triangles = triangles;
        this.vertices = vertices;
        this.normals = [];
        this.verticesNormals = [];
        if (normals) this.normals = normals;
        else this.calculateNormals();

        if (verticesNormals) this.verticesNormals = verticesNormals;
    }

    calculateNormals() {
        this.normals = [];
        this.triangles.forEach((t) => {
            const v1 = this.vertices[t[1]].subtract(this.vertices[t[0]]);
            const v2 = this.vertices[t[2]].subtract(this.vertices[t[0]]);
            this.normals.push(v1.crossProduct(v2).normalize());
        });
    }

    calculateBoundingSphere() {
        const center = this.vertices
            .reduce((pV: Vector3, cV: Vector3) => cV.add(pV))
            .multiply(1 / this.vertices.length);
        let radius = 0;
        this.vertices.forEach((v) => {
            const x = center.subtract(v).squareLength();
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
        return new Mesh(
            this.vertices,
            this.triangles,
            this.normals,
            this.verticesNormals
        );
    }

    project(camera: Camera, transform: Transform) {
        const copy = this.copy();
        copy.vertices = copy.vertices.map((v) =>
            camera.transformToCamera(transform.apply(v))
        );
        copy.normals = copy.normals.map((n) =>
            camera.transformNormalToCamera(transform.rotateVector(n))
        );
        copy.verticesNormals = copy.verticesNormals.map((vn) =>
            camera.transformNormalToCamera(transform.rotateVector(vn))
        );
        copy.calculateBoundingSphere();
        return copy;
    }

    toArrayOfTriangles() {
        return this.triangles.map(
            (t, i) =>
                new Triangle(
                    t.map((i) => this.vertices[i]) as [
                        Vector3,
                        Vector3,
                        Vector3
                    ],
                    this.normals[i],
                    this.verticesNormals.length > 0
                        ? (t.map((i) => this.verticesNormals[i]) as [
                              Vector3,
                              Vector3,
                              Vector3
                          ])
                        : undefined
                )
        );
    }
}
