import Color from "./Color";
import Vector2 from "./Vector2";
import Vector3 from "./Vector3";

export default class Triangle {
    vertices: [Vector3, Vector3, Vector3];

    constructor(vertices: [Vector3, Vector3, Vector3]) {
        this.vertices = vertices;
    }

    copy() {
        return new Triangle(
            this.vertices.map((v) => v.copy()) as [Vector3, Vector3, Vector3]
        );
    }
}

export class Triangle2D {
    vertices: [Vector2, Vector2, Vector2];
    color: Color;

    constructor(
        vertices: [Vector2, Vector2, Vector2],
        color: Color = Color.white
    ) {
        this.vertices = vertices;
        this.color = color;
    }
}
