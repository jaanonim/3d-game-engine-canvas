import Mesh from "../utilities/Mesh";
import Vector3 from "../utilities/Vector3";

export default class ObjLoader {
    raw: String;

    constructor(text: String) {
        this.raw = text;
    }

    parse() {
        let vertices: Array<Vector3> = [];
        let triangles: Array<[number, number, number]> = [];

        let vertexMatches = this.raw.match(/^v( -?\d+(\.\d+)?){3}$/gm);
        if (vertexMatches) {
            vertices = vertexMatches.map((vertex) => {
                let vertices = vertex.split(" ");
                vertices.shift();
                return new Vector3(
                    parseFloat(vertices[0]),
                    parseFloat(vertices[1]),
                    parseFloat(vertices[2])
                );
            });
        }

        let facesMatches = this.raw.match(/^f(.*)([^\n]*\n+)/gm);
        if (facesMatches) {
            triangles = facesMatches.map((face) => {
                let faces = face.split(" ");
                faces.shift();
                const f: number[] = [];
                faces.forEach((e, i) => {
                    if (e.indexOf("/") !== -1) {
                        f[i] = parseFloat(e.split("/")[0]) - 1;
                    } else {
                        f[i] = parseFloat(e) - 1;
                    }
                });
                return f as [number, number, number];
            });
        }

        //* May be used later
        // let name = this.raw.match(/^o (\S+)/gm);
        // if (name) {
        //     obj.name = name[0].split(" ")[1];
        // }

        return new Mesh(vertices, triangles);
    }
}
