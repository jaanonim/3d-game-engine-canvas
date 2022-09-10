import Mesh from "./Mesh";
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

    clipObject(mesh: Mesh) {
        const d = this.distance(mesh.boundingSphere.center);
        if (mesh.boundingSphere.radius < d) {
            return mesh;
        } else if (-mesh.boundingSphere.radius > d) {
            return null;
        } else {
            return this.clipTriangles(mesh);
        }
    }

    clipTriangles(mesh: Mesh) {
        return mesh;
        const m = mesh.copy();
        m.triangles.forEach((_t, i) => {
            this.clipTriangle(i, m);
        });
        return m;
    }

    clipTriangle(i: number, mesh: Mesh) {
        const d0 = this.distance(mesh.vertices[mesh.triangles[i][0]]);
        const d1 = this.distance(mesh.vertices[mesh.triangles[i][1]]);
        const d2 = this.distance(mesh.vertices[mesh.triangles[i][2]]);
        if (d0 >= 0 && d1 >= 0 && d2 >= 0) {
            return mesh;
        } else if (d0 <= 0 && d1 <= 0 && d2 <= 0) {
            mesh.triangles.splice(i);
            return mesh;
        } else if (d0 > 0 && d1 < 0 && d2 < 0) {
            mesh.vertices[mesh.triangles[i][1]];
            mesh.vertices[mesh.triangles[i][2]];
        }
        return mesh;
    }
}
