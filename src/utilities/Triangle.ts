import Renderer from "../classes/Renderer";
import Camera from "../components/Camera";
import Vector3 from "./math/Vector3";
import Transform from "./Transform";

export default class Triangle {
    vertices: [Vector3, Vector3, Vector3];
    verticesUvs: [Vector3, Vector3, Vector3];
    verticesNormals: [Vector3, Vector3, Vector3];
    normal: Vector3;

    constructor(
        vertices: [Vector3, Vector3, Vector3],
        verticesUvs?: [Vector3, Vector3, Vector3],
        verticesNormals?: [Vector3, Vector3, Vector3],
        normal?: Vector3
    ) {
        this.vertices = vertices;

        this.normal = Vector3.zero;
        if (normal) this.normal = normal;
        else this.calculateNormal();

        if (verticesNormals) this.verticesNormals = verticesNormals;
        else this.verticesNormals = [this.normal, this.normal, this.normal];

        if (verticesUvs) this.verticesUvs = verticesUvs;
        else this.verticesUvs = [Vector3.zero, Vector3.zero, Vector3.zero];
    }

    center() {
        return this.vertices
            .reduce((p, c) => p.add(c))
            .multiply(1 / this.vertices.length);
    }

    copy() {
        return new Triangle(
            this.vertices.map((v) => v.copy()) as [Vector3, Vector3, Vector3],
            this.verticesUvs,
            this.verticesNormals,
            this.normal
        );
    }

    calculateNormal() {
        const v1 = this.vertices[1].subtract(this.vertices[0]);
        const v2 = this.vertices[2].subtract(this.vertices[0]);
        this.normal = v1.crossProduct(v2).normalize();
    }

    transform(camera: Camera, transform: Transform) {
        const copy = this.copy();
        copy.vertices = copy.vertices.map((v) =>
            camera.transformToCamera(transform.apply(v))
        ) as [Vector3, Vector3, Vector3];
        copy.verticesNormals = copy.verticesNormals.map((vn) =>
            camera.transformNormalToCamera(transform.rotateVector(vn))
        ) as [Vector3, Vector3, Vector3];
        copy.normal = camera.transformNormalToCamera(
            transform.rotateVector(copy.normal)
        );
        return copy;
    }

    project(camera: Camera, renderer: Renderer) {
        const copy = this.copy();
        copy.vertices = copy.vertices.map((v) =>
            camera.projectVertex(v, renderer)
        ) as [Vector3, Vector3, Vector3];
        return copy;
    }
}
