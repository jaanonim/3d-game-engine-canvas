import Mesh from "../utilities/Mesh";
import Transform from "../utilities/Transform";
import Vector3 from "../utilities/math/Vector3";
import Camera from "../components/Camera";
import Material from "./Materials/Material";
import Drawer from "./Drawer";

export default class Renderer {
    /**In milliseconds */
    static deltaTime: number = 0;
    canvas: HTMLCanvasElement;
    cameras: Array<{ camera: Camera; layer: number }>;
    drawer: Drawer;
    canvasRatio: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.onresize = this.resize.bind(this);
        this.canvasRatio = 0;
        this.cameras = [];

        let ctx = canvas.getContext("2d");
        if (ctx == null) throw Error("Cannot get context");
        this.drawer = new Drawer(ctx, this.canvas.width, this.canvas.height);
        this.resize();
    }

    setCamera(camera: Camera, layer: number) {
        this.cameras.push({ camera, layer });
        this.cameras.sort((a, b) => b.layer - a.layer);
        this.resize();
        return camera;
    }

    resize() {
        this.canvasRatio = this.canvas.width / this.canvas.height;
        this.drawer.resize(this.canvas.width, this.canvas.height);
        if (this.cameras.length)
            this.cameras.forEach((c) => c.camera.resize(this.canvasRatio));
    }

    async startGameLoop(update = () => {}, lateUpdate = () => {}) {
        await Promise.all(this.cameras.map((c) => c.camera.scene.start()));
        await this.gameLoop(update, lateUpdate);
    }

    async gameLoop(update = () => {}, lateUpdate = () => {}) {
        const start = performance.now();

        update();
        await Promise.all(this.cameras.map((c) => c.camera.scene.update()));

        this.render();

        lateUpdate();
        await Promise.all(this.cameras.map((c) => c.camera.scene.lateUpdate()));

        Renderer.deltaTime = performance.now() - start;

        requestAnimationFrame(async () => {
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

    viewportToCanvas(v: Vector3, camera: Camera) {
        return new Vector3(
            (v.x * this.canvas.width) / camera.viewportSize.x +
                this.canvas.width / 2,
            -(v.y * this.canvas.height) / camera.viewportSize.y +
                this.canvas.height / 2,
            v.z
        ).roundXYToInt();
    }

    getOriginalCoords(v: Vector3, camera: Camera) {
        return new Vector3(
            ((v.x - this.canvas.width / 2) * camera.viewportSize.x) /
                this.canvas.width,

            ((v.y - this.canvas.height / 2) * -camera.viewportSize.y) /
                this.canvas.height,
            v.z
        );
    }

    renderMesh(
        mesh: Mesh,
        material: Material,
        transform: Transform,
        camera: Camera
    ) {
        if (camera) {
            const transformedMesh = mesh.transform(camera, transform);

            const res = camera.preClipObject(transformedMesh.boundingSphere);
            if (res === -1) return;

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
