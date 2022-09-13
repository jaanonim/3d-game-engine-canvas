import Color from "./Color";
import Vector3 from "./Vector3";

export default class Triangle {
    vertices: [Vector3, Vector3, Vector3];
    color: Color;

    constructor(
        vertices: [Vector3, Vector3, Vector3],
        color: Color = Color.white
    ) {
        this.vertices = vertices;
        this.color = color;
    }

    copy() {
        return new Triangle(
            this.vertices.map((v) => v.copy()) as [Vector3, Vector3, Vector3]
        );
    }
}
