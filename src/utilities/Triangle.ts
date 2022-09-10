import Vector2 from "./Vector2";
import Vector3 from "./Vector3";

export default class Triangle {
    vertices: [Vector3, Vector3, Vector3];

    constructor(vertices: [Vector3, Vector3, Vector3]) {
        this.vertices = vertices;
    }
}

export class Triangle2D {
    vertices: [Vector2, Vector2, Vector2];

    constructor(vertices: [Vector2, Vector2, Vector2]) {
        this.vertices = vertices;
    }
}
