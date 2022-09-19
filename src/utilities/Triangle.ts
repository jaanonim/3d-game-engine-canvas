import Vector3 from "./math/Vector3";

export default class Triangle {
    vertices: [Vector3, Vector3, Vector3];
    verticesNormals: [Vector3, Vector3, Vector3];
    normal: Vector3;

    constructor(
        vertices: [Vector3, Vector3, Vector3],
        normal: Vector3,
        verticesNormals?: [Vector3, Vector3, Vector3]
    ) {
        this.vertices = vertices;
        this.normal = normal;
        if (verticesNormals) this.verticesNormals = verticesNormals;
        else this.verticesNormals = [this.normal, this.normal, this.normal];
    }

    center() {
        return this.vertices
            .reduce((p, c) => p.add(c))
            .multiply(1 / this.vertices.length);
    }

    copy() {
        return new Triangle(
            this.vertices.map((v) => v.copy()) as [Vector3, Vector3, Vector3],
            this.normal,
            this.verticesNormals
        );
    }
}
