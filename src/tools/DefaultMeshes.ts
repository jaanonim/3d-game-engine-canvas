import Mesh from "../utilities/Mesh";
import FileLoader from "./FileLoader";
import ObjLoader from "./ObjLoader";

export default class DefaultMeshes {
    private static _plane: Mesh;
    static get plane() {
        return new Promise<Mesh>((res, rej) => {
            if (!DefaultMeshes._plane) {
                FileLoader.load("/plane.obj")
                    .then((f) => {
                        DefaultMeshes._plane = new ObjLoader(f).parse();
                        res(DefaultMeshes._plane);
                    })
                    .catch((e) => rej(e));
            } else {
                res(DefaultMeshes._plane);
            }
        });
    }
}
