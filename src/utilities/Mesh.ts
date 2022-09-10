import Vector3 from "./Vector3";

interface Sphere {
    center: Vector3;
    radius: number;
}

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
        this.process();
    }

    process() {
        this.calculateBoundingSphere();
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
}
