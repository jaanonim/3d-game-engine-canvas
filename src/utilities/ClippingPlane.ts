import { Sphere } from "./Math";
import Triangle from "./Triangle";
import Vector3 from "./Vector3";

export default class ClippingPlane {
    normal: Vector3;
    d: number;

    constructor(normal: Vector3 = Vector3.zero, d: number = 0) {
        this.normal = normal;
        this.d = d;
    }

    distance(v: Vector3) {
        return v.dotProduct(this.normal) + this.d;
    }

    intersection(a: Vector3, b: Vector3) {
        const ab = a.add(b.invert());
        return ab
            .multiply(
                (-this.d - a.dotProduct(this.normal)) /
                    ab.dotProduct(this.normal)
            )
            .add(a);
    }

    clipObject(triangles: Array<Triangle>, boundingSphere: Sphere) {
        const d = this.distance(boundingSphere.center);
        if (boundingSphere.radius < d) {
            return triangles;
        } else if (-boundingSphere.radius > d) {
            return null;
        } else {
            return this.clipTriangles(triangles.map((t) => t.copy()));
        }
    }

    clipTriangles(triangles: Array<Triangle>) {
        triangles.forEach((_t, i) => {
            this.clipTriangle(i, triangles);
        });
        return triangles;
    }

    clipTriangle(i: number, triangles: Array<Triangle>) {
        const d0 = this.distance(triangles[i].vertices[0]);
        const d1 = this.distance(triangles[i].vertices[1]);
        const d2 = this.distance(triangles[i].vertices[2]);

        if (d0 >= 0 && d1 >= 0 && d2 >= 0) {
            return;
        } else if (d0 <= 0 && d1 <= 0 && d2 <= 0) {
            triangles = triangles.filter((_e, x) => x !== i);
            return;
        } else if (d0 > 0 && d1 < 0 && d2 < 0) {
            triangles[i].vertices[1] = this.intersection(
                triangles[i].vertices[1],
                triangles[i].vertices[0]
            );
            triangles[i].vertices[2] = this.intersection(
                triangles[i].vertices[2],
                triangles[i].vertices[0]
            );
        } else if (d0 < 0 && d1 > 0 && d2 < 0) {
            triangles[i].vertices[0] = this.intersection(
                triangles[i].vertices[0],
                triangles[i].vertices[1]
            );
            triangles[i].vertices[2] = this.intersection(
                triangles[i].vertices[2],
                triangles[i].vertices[1]
            );
        } else if (d0 < 0 && d1 < 0 && d2 > 0) {
            triangles[i].vertices[0] = this.intersection(
                triangles[i].vertices[0],
                triangles[i].vertices[2]
            );
            triangles[i].vertices[1] = this.intersection(
                triangles[i].vertices[1],
                triangles[i].vertices[2]
            );
        } else if (d0 > 0 && d1 > 0 && d2 < 0) {
            const _02 = this.intersection(
                triangles[i].vertices[0],
                triangles[i].vertices[2]
            );
            const _12 = this.intersection(
                triangles[i].vertices[1],
                triangles[i].vertices[2]
            );
            triangles[i] = new Triangle([
                triangles[i].vertices[0],
                triangles[i].vertices[1],
                _02,
            ]);
            triangles.push(new Triangle([triangles[i].vertices[1], _02, _12]));
        } else if (d0 > 0 && d1 < 0 && d2 > 0) {
            const _01 = this.intersection(
                triangles[i].vertices[0],
                triangles[i].vertices[1]
            );
            const _12 = this.intersection(
                triangles[i].vertices[1],
                triangles[i].vertices[2]
            );
            triangles[i] = new Triangle([
                triangles[i].vertices[0],
                triangles[i].vertices[2],
                _01,
            ]);
            triangles.push(new Triangle([triangles[i].vertices[2], _01, _12]));
        } else if (d0 < 0 && d1 > 0 && d2 > 0) {
            const _01 = this.intersection(
                triangles[i].vertices[0],
                triangles[i].vertices[1]
            );
            const _02 = this.intersection(
                triangles[i].vertices[0],
                triangles[i].vertices[2]
            );
            triangles[i] = new Triangle([
                triangles[i].vertices[1],
                triangles[i].vertices[2],
                _01,
            ]);
            triangles.push(new Triangle([triangles[i].vertices[1], _01, _02]));
        }
    }
}
