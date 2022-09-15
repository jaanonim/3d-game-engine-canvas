import Color from "./Color";
import Vector3 from "./Vector3";

export default class Triangle {
    vertices: [Vector3, Vector3, Vector3];
    normal: Vector3;
    color: Color;

    constructor(
        vertices: [Vector3, Vector3, Vector3],
        normal: Vector3,
        color: Color = Color.white
    ) {
        this.vertices = vertices;
        this.color = color;
        this.normal = normal;
    }

    transformToInt() {
        const copy = this.copy();
        copy.vertices.forEach((v) => {
            v.x = Math.round(v.x);
            v.y = Math.round(v.y);
            v.z = Math.round(v.z);
        });
        return copy;
    }

    copy() {
        return new Triangle(
            this.vertices.map((v) => v.copy()) as [Vector3, Vector3, Vector3],
            this.normal
        );
    }
}
