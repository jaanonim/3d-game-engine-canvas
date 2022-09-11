import Mesh from "../utilities/Mesh";
import Transform from "../utilities/Transform";
import { Triangle2D } from "../utilities/Triangle";
import Vector2 from "../utilities/Vector2";
import Camera from "./Camera";
import Drawer from "./Drawers";
import DrawerPerPixel from "./Drawers/DrawerPerPixel";
import DrawerStandard from "./Drawers/DrawerStandard";
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

    viewportToCanvas(v: Vector2) {
        if (!this.camera) {
            console.warn("No camera!");
            return Vector2.zero;
        }

        return new Vector2(
            (v.x * this.canvas.width) / this.camera.viewportSize.x +
                this.canvas.width / 2,
            (v.y * this.canvas.height) / this.camera.viewportSize.y +
                this.canvas.height / 2
        );
    }

    renderTriangle(triangle: Triangle2D) {
        this.drawer.drawTriangleWireframe(
            triangle.vertices[0],
            triangle.vertices[1],
            triangle.vertices[2],
            triangle.color
        );
    }

    renderMesh(mesh: Mesh, transform: Transform) {
        if (this.camera) {
            const projectedMesh = mesh.project(this.camera, transform);

            const res = this.camera.preClipObject(projectedMesh.boundingSphere);
            if (res === -1) return;

            let triangles = projectedMesh.toArrayOfTriangles();
            if (res === 0) triangles = this.camera.clipObject(triangles);

            const triangles2d = triangles.map(
                (t) =>
                    new Triangle2D(
                        t.vertices.map((v) => {
                            if (this.camera)
                                return this.camera.projectVertex(v, this);
                            else throw Error("This is really bad");
                        }) as [Vector2, Vector2, Vector2]
                    )
            );

            triangles2d.forEach((t) => {
                this.renderTriangle(t);
            });
        } else {
            console.warn("No camera!");
            return;
        }
    }
}
