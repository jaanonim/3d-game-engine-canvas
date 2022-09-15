import Mesh from "../utilities/Mesh";
import Transform from "../utilities/Transform";
import Triangle from "../utilities/Triangle";
import Vector3 from "../utilities/Vector3";
import Camera from "../components/Camera";
import Drawer from "./Drawers";
import DrawerPerPixel from "./Drawers/DrawerPerPixel";
import Scene from "./Scene";

export default class Renderer {
    static deltaTime: number = 0;
    canvas: HTMLCanvasElement;
    camera: Camera | null;
    scene: Scene | null;
    drawer: Drawer;

    canvasRatio: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.onresize = this.resize;
        this.canvasRatio = 0;
        this.camera = null;
        this.scene = null;

        let ctx = canvas.getContext("2d");
        if (ctx == null) throw Error("Cannot get context");
        this.drawer = new DrawerPerPixel(
            ctx,
            this.canvas.width,
            this.canvas.height
        );
        this.resize();
    }

    setCamera(camera: Camera) {
        this.camera = camera;
        this.resize();
        return camera;
    }

    resize() {
        this.canvasRatio = this.canvas.width / this.canvas.height;
        this.drawer.resize(this.canvas.width, this.canvas.height);
        if (this.camera) this.camera.resize(this.canvasRatio);
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    startGameLoop(update = () => {}, lateUpdate = () => {}) {
        this.gameLoop(update, lateUpdate);
    }

    gameLoop(update = () => {}, lateUpdate = () => {}) {
        if (!this.scene) {
            console.warn("No scene!");
            return;
        }
        const start = performance.now();

        update();
        this.scene.update();

        this.render();

        lateUpdate();
        this.scene.lateUpdate();

        Renderer.deltaTime = performance.now() - start;

        requestAnimationFrame(() => {
            this.gameLoop.bind(this)(update, lateUpdate);
        });
    }

    render() {
        if (!this.camera) {
            console.warn("No camera!");
            return;
        }
        if (!this.scene) {
            console.warn("No scene!");
            return;
        }

        this.drawer.begin();
        this.scene.render(this);
        this.drawer.end();
    }

    viewportToCanvas(v: Vector3) {
        if (!this.camera) {
            console.warn("No camera!");
            return Vector3.zero;
        }

        return new Vector3(
            (v.x * this.canvas.width) / this.camera.viewportSize.x +
                this.canvas.width / 2,
            (v.y * this.canvas.height) / this.camera.viewportSize.y +
                this.canvas.height / 2,
            v.z
        );
    }

    renderTriangle(triangle: Triangle) {
        const t = triangle.transformToInt();
        // this.drawer.drawTriangleWireframe(
        //     t.vertices[0],
        //     t.vertices[1],
        //     t.vertices[2],
        //     Color.red
        // );
        this.drawer.drawTriangleFilled(
            t.vertices[0],
            t.vertices[1],
            t.vertices[2],
            t.color
        );
    }

    renderMesh(mesh: Mesh, transform: Transform) {
        if (this.camera) {
            const projectedMesh = mesh.project(this.camera, transform);

            const res = this.camera.preClipObject(projectedMesh.boundingSphere);
            if (res === -1) return;

            let triangles = projectedMesh.toArrayOfTriangles();
            triangles = triangles.filter(
                (t) => t.normal.dotProduct(t.vertices[0].invert()) > 0
            );

            if (res === 0) triangles = this.camera.clipObject(triangles);

            const projectTriangles = triangles.map(
                (t) =>
                    new Triangle(
                        t.vertices.map((v) => {
                            if (this.camera)
                                return this.camera.projectVertex(v, this);
                            else throw Error("This is really bad");
                        }) as [Vector3, Vector3, Vector3],
                        t.normal
                    )
            );

            projectTriangles.forEach((t) => {
                this.renderTriangle(t);
            });
        } else {
            console.warn("No camera!");
            return;
        }
    }
}
