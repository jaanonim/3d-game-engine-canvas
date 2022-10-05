import Mesh from "../utilities/Mesh";
import ObjLoader from "./ObjLoader";

export default class DefaultMeshes {
    private static _plane: Mesh;
    static get plane() {
        if (!DefaultMeshes._plane)
            DefaultMeshes._plane = new ObjLoader(`
            # Blender 3.3.0
            # www.blender.org
            mtllib untitled.mtl
            o Plane
            v -1.000000  1.000000 0
            v 1.000000  1.000000 0
            v -1.000000  -1.000000 0
            v 1.000000  -1.000000 0
            vn -0.0000 1.0000 -0.0000
            
            vt 1 0
            vt 0 0
            vt 1 1
            vt 0 1
            
            
            s 0
            usemtl Material
            f 2/1/1 4/3/1 3/4/1 1/2/1
            `).parse();
        return DefaultMeshes._plane;
    }

    private static _cube: Mesh;
    static get cube() {
        if (!DefaultMeshes._cube)
            DefaultMeshes._cube = new ObjLoader(`
            # cube.obj
            #
            
            o cube
            
            v -0.500000 -0.500000 0.500000
            v 0.500000 -0.500000 0.500000
            v -0.500000 0.500000 0.500000
            v 0.500000 0.500000 0.500000
            v -0.500000 0.500000 -0.500000
            v 0.500000 0.500000 -0.500000
            v -0.500000 -0.500000 -0.500000
            v 0.500000 -0.500000 -0.500000
            
            vt 0.000000 0.000000
            vt 1.000000 0.000000
            vt 0.000000 1.000000
            vt 1.000000 1.000000
            
            vn 0.000000 0.000000 1.000000
            vn 0.000000 1.000000 0.000000
            vn 0.000000 0.000000 -1.000000
            vn 0.000000 -1.000000 0.000000
            vn 1.000000 0.000000 0.000000
            vn -1.000000 0.000000 0.000000
            
            g cube
            
            s 1
            f 1/1/1 2/2/1 3/3/1
            f 3/3/1 2/2/1 4/4/1
            s 2
            f 3/1/2 4/2/2 5/3/2
            f 5/3/2 4/2/2 6/4/2
            s 3
            f 5/4/3 6/3/3 7/2/3
            f 7/2/3 6/3/3 8/1/3
            s 4
            f 7/1/4 8/2/4 1/3/4
            f 1/3/4 8/2/4 2/4/4
            s 5
            f 2/1/5 8/2/5 4/3/5
            f 4/3/5 8/2/5 6/4/5
            s 6
            f 7/1/6 1/2/6 5/3/6
            f 5/3/6 1/2/6 3/4/6
            `).parse();
        return DefaultMeshes._cube;
    }
}
