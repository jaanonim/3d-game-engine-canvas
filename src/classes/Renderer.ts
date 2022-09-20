import Mesh from "../utilities/Mesh";
import Transform from "../utilities/Transform";
import Vector3 from "../utilities/math/Vector3";
import Camera from "../components/Camera";
import Drawer from "./Drawers";
import DrawerPerPixel from "./Drawers/DrawerPerPixel";
import Scene from "./Scene";
import Material from "./Materials/Material";

export default class Renderer {
    /**In milliseconds */
    static deltaTime: number = 0;
    canvas: HTMLCanvasElement;
    camera: Camera | null;
    scene: Scene | null;
    drawer: Drawer;

    canvasRatio: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.onresize = this.resize.bind(this);
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
        if (!this.scene) {
            console.warn("No scene!");
            return;
        }

        this.scene.start();
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
            -(v.y * this.canvas.height) / this.camera.viewportSize.y +
                this.canvas.height / 2,
            v.z
        ).roundXYToInt();
    }

    getOriginalCoords(v: Vector3) {
        if (!this.camera) {
            console.warn("No camera!");
            return Vector3.zero;
        }
        return new Vector3(
            ((v.x - this.canvas.width / 2) * this.camera.viewportSize.x) /
                this.canvas.width,

            ((v.y - this.canvas.height / 2) * -this.camera.viewportSize.y) /
                this.canvas.height,
            v.z
        );
    }

    renderMesh(mesh: Mesh, material: Material, transform: Transform) {
        if (this.camera) {
            const transformedMesh = mesh.transform(this.camera, transform);

            const res = this.camera.preClipObject(
                transformedMesh.boundingSphere
            );
            if (res === -1) return;

            transformedMesh.triangles = transformedMesh.triangles.filter(
                (t) => t.normal.dotProduct(t.vertices[0].invert()) > 0
            );

            if (res === 0) {
                transformedMesh.triangles = this.camera.clipObject(
                    transformedMesh.triangles
                );
            }

            const projectedMesh = transformedMesh.project(this.camera, this);

            projectedMesh.triangles.forEach((t, i) => {
                material.renderTriangle(t, transformedMesh.triangles[i], this);
            });
        } else {
            console.warn("No camera!");
            return;
        }
    }
}
