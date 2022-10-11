import Mesh from "../utilities/Mesh";
import Vector3 from "../utilities/math/Vector3";
import Triangle from "../utilities/Triangle";

export default class ObjLoader {
    raw: String;

    constructor(text: String) {
        this.raw = text;
        if (this.raw.indexOf("\r\n") !== -1) {
            this.raw = this.raw.replace(/\r\n/g, "\n");
        }
        if (this.raw.indexOf("\\\n") !== -1) {
            this.raw = this.raw.replace(/\\\n/g, "");
        }
    }

    parse(hide = false) {
        const lines = this.raw.split("\n");
        let vertices: Array<Vector3> = [];
        let normals: Array<Vector3> = [];
        let uvs: Array<Vector3> = [];
        let triangles = [];

        for (let i = 0, l = lines.length; i < l; i++) {
            const line = lines[i].trimStart();

            if (line.length === 0) continue;

            const lineFirstChar = line.charAt(0);

            if (lineFirstChar === "#") continue;
            if (lineFirstChar === "v") {
                const data = line.split(/\s+/);
                if (data[0] == "v") {
                    vertices.push(
                        new Vector3(
                            parseFloat(data[1]),
                            parseFloat(data[2]),
                            parseFloat(data[3])
                        )
                    );
                } else if (data[0] == "vn") {
                    normals.push(
                        new Vector3(
                            parseFloat(data[1]),
                            parseFloat(data[2]),
                            parseFloat(data[3])
                        )
                    );
                } else if (data[0] == "vt") {
                    uvs.push(
                        new Vector3(
                            parseFloat(data[1]),
                            parseFloat(data[2]) || 0,
                            parseFloat(data[3]) || 0
                        )
                    );
                }
            } else if (lineFirstChar === "f") {
                const lineData = line.slice(1).trim();
                const data = lineData.split(/\s+/);

                const tVertexes = [];
                const tNormals = [];
                const tUvs = [];

                if (data.length < 3)
                    throw new Error(
                        "Invalid count of points in faces in .obj file"
                    );
                for (let index = 0; index < data.length; index++) {
                    if (data[index].length > 0) {
                        const parts = data[index].split("/");
                        let processedParts = [];
                        if (parts.length === 1) {
                            const v = parseInt(parts[0]);
                            if (isNaN(v)) {
                                throw new Error(
                                    "Missing part in faces in .obj file"
                                );
                            }
                            processedParts = [v, v, v];
                        } else if (parts.length === 2) {
                            processedParts = parts.map((e) => parseInt(e));
                            if (isNaN(processedParts[0])) {
                                throw new Error(
                                    "Missing first part in faces in .obj file"
                                );
                            }
                            if (isNaN(processedParts[1]))
                                processedParts[1] = processedParts[0];
                            processedParts[2] = processedParts[1];
                        } else if (parts.length === 3) {
                            processedParts = parts.map((e) => parseInt(e));
                            if (isNaN(processedParts[0])) {
                                throw new Error(
                                    "Missing first part in faces in .obj file"
                                );
                            }
                            if (isNaN(processedParts[1]))
                                processedParts[1] = processedParts[0];
                            if (isNaN(processedParts[2]))
                                processedParts[2] = processedParts[1];
                        } else {
                            throw new Error(
                                "Invalid parts count in faces in .obj file"
                            );
                        }
                        tVertexes.push(processedParts[0]);
                        tUvs.push(processedParts[1]);
                        tNormals.push(processedParts[2]);
                    }
                }

                const resUvs = tUvs.map((i) => uvs[i - 1]);
                const resNormals = tNormals.map((i) => normals[i - 1]);
                const resVertexes = tVertexes.map((i) => vertices[i - 1]);

                if (resVertexes.length === 3) {
                    triangles.push(
                        new Triangle(
                            [resVertexes[0], resVertexes[1], resVertexes[2]],
                            resUvs[0] == undefined
                                ? undefined
                                : [resUvs[0], resUvs[1], resUvs[2]],
                            resNormals[0] == undefined
                                ? undefined
                                : [resNormals[0], resNormals[1], resNormals[2]],
                            undefined,
                            [false, false, false]
                        )
                    );
                } else
                    for (let j = 2; j < resVertexes.length; j++) {
                        triangles.push(
                            new Triangle(
                                [
                                    resVertexes[0],
                                    resVertexes[j - 1],
                                    resVertexes[j],
                                ],
                                resUvs[0] == undefined
                                    ? undefined
                                    : [resUvs[0], resUvs[j - 1], resUvs[j]],
                                resNormals[0] == undefined
                                    ? undefined
                                    : [
                                          resNormals[0],
                                          resNormals[j - 1],
                                          resNormals[j],
                                      ],
                                undefined,
                                hide
                                    ? [
                                          j !== 2,
                                          false,
                                          j < resVertexes.length - 1,
                                      ]
                                    : [false, false, false]
                            )
                        );
                    }
            }
        }
        return new Mesh(triangles);
    }
}
