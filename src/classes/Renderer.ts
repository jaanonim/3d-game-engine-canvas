import Mesh from "../utilities/Mesh";
import Vector3 from "../utilities/math/Vector3";
import Camera from "../components/Camera";
import Material from "./Materials/Material";
import Drawer from "./Drawer";
import Event from "./Event";
import Vector2 from "../utilities/math/Vector2";

export interface onResizeArgs {
    canvasRatio: number;
    width: number;
    height: number;
    scale: number;
}

export default class Renderer {
    /**In milliseconds */
    static deltaTime: number = 0;
    canvas: HTMLCanvasElement;
    cameras: Array<{ camera: Camera; layer: number }>;
    drawer: Drawer;
    canvasRatio: number;
    onResize: Event<onResizeArgs>;
    scale: number;

    get width(): number {
        return Math.round(this.canvas.width * this.scale);
    }
    get height(): number {
        return Math.round(this.canvas.height * this.scale);
    }

    constructor(
        canvas: HTMLCanvasElement,
        scale: number = 1,
        smoothing: boolean = true
    ) {
        this.canvas = canvas;
        this.canvas.onresize = this.resize.bind(this);
        this.canvasRatio = 0;
        this.cameras = [];
        this.scale = scale;
        this.onResize = new Event<onResizeArgs>();

        let ctx = canvas.getContext("2d");
        if (ctx == null) throw Error("Cannot get context");
        ctx.imageSmoothingEnabled = smoothing;
        this.drawer = new Drawer(ctx, this.canvas.width, this.canvas.height);
        this.resize();
    }

    setCamera(camera: Camera, layer: number) {
        this.cameras.push({ camera, layer });
        this.cameras.sort((a, b) => b.layer - a.layer);
        this.resize();
        return camera;
    }

    removeCamera(camera: Camera): void {
        this.cameras = this.cameras.filter((c) => c.camera !== camera);
        this.resize();
    }

    resize() {
        this.canvasRatio = this.canvas.width / this.canvas.height;
        this.drawer.resize(this.width, this.height);
        this.onResize.call({
            canvasRatio: this.canvasRatio,
            width: this.width,
            height: this.height,
            scale: this.scale,
        });
    }

    async startGameLoop(update = () => {}, lateUpdate = () => {}) {
        await Promise.all(this.cameras.map((c) => c.camera.scene.awake()));
        await this.gameLoop(update, lateUpdate);
    }

    async gameLoop(update = () => {}, lateUpdate = () => {}) {
        const start = performance.now();

        update();
        await Promise.all(this.cameras.map((c) => c.camera.scene.update()));

        this.render();

        lateUpdate();
        await Promise.all(this.cameras.map((c) => c.camera.scene.lateUpdate()));

        requestAnimationFrame(async () => {
            Renderer.deltaTime = performance.now() - start;
            await this.gameLoop.bind(this)(update, lateUpdate);
        });
    }

    render() {
        this.drawer.begin();
        this.cameras.forEach((c) => {
            c.camera.scene.render(this, c.camera);
        });
        this.drawer.end();
    }

    scaleCanvasVector(v: Vector2) {
        return v.multiply(this.scale);
    }

    viewportToCanvas(v: Vector3, camera: Camera) {
        return new Vector3(
            (v.x * this.drawer.width) / camera.viewportSize.x +
                this.drawer.width / 2,
            -(v.y * this.drawer.height) / camera.viewportSize.y +
                this.drawer.height / 2,
            v.z
        ).roundXYToInt();
    }

    canvasToViewport(v: Vector2, camera: Camera) {
        return new Vector2(
            ((v.x - this.drawer.width / 2) * camera.viewportSize.x) /
                this.drawer.width,
            -((v.y - this.drawer.height / 2) * camera.viewportSize.y) /
                this.drawer.height
        );
    }

    getOriginalCoords(v: Vector3, camera: Camera) {
        return new Vector3(
            ((v.x - this.drawer.width / 2) * camera.viewportSize.x) /
                this.drawer.width,

            ((v.y - this.drawer.height / 2) * -camera.viewportSize.y) /
                this.drawer.height,
            v.z
        );
    }

    renderMesh(mesh: Mesh, material: Material, camera: Camera) {
        if (camera) {
            const transformedMesh = mesh.transformToCamera(camera);

            const res = camera.preClipObject(transformedMesh.boundingSphere);
            if (res === -1) return;

            if (!mesh.doubleSided)
                transformedMesh.triangles = transformedMesh.triangles.filter(
                    (t) => t.normal.dotProduct(t.vertices[0].invert()) > 0
                );

            if (res === 0) {
                transformedMesh.triangles = camera.clipObject(
                    transformedMesh.triangles
                );
            }

            const projectedMesh = transformedMesh.project(camera, this);

            projectedMesh.triangles.forEach((t, i) => {
                material.renderTriangle(
                    t,
                    transformedMesh.triangles[i],
                    this,
                    camera
                );
            });
        } else {
            console.warn("No camera!");
            return;
        }
    }
}
