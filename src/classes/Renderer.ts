import Color from "../utilities/Color";
import Mesh from "../utilities/Mesh";
import Transform from "../utilities/Transform";
import Vector2 from "../utilities/Vector2";
import Camera from "./Camera";
import Scene from "./Scene";

export default class Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    camera: Camera | null;
    scene: Scene | null;

    canvasRatio: number;
    _viewportSize: Vector2;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.onresize = this.resize;
        this._viewportSize = Vector2.zero;
        this.canvasRatio = 0;
        this.camera = null;
        this.scene = null;
        this.resize();

        let ctx = canvas.getContext("2d");
        if (ctx == null) throw Error("Cannot get context");
        this.ctx = ctx;
    }

    setCamera(camera: Camera) {
        this.camera = camera;
        this.resize();
        return camera;
    }

    resize() {
        this.canvasRatio = this.canvas.width / this.canvas.height;
        this._viewportSize = new Vector2(this.canvasRatio, 1);
        if (this.camera) this.camera.resize(this.canvasRatio);
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    startGameLoop() {
        this.gameLoop();
    }

    gameLoop() {
        if (!this.scene) {
            console.warn("No scene!");
            return;
        }
        this.scene.update();
        this.render();
        this.scene.lateUpdate();
        requestAnimationFrame(this.gameLoop.bind(this));
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

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.scene.render(this);
        this.ctx.closePath();
        this.ctx.stroke();
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

    drawTriangleWireframe(
        p1: Vector2,
        p2: Vector2,
        p3: Vector2,
        color: string
    ) {
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p3.x, p3.y);
        this.ctx.lineTo(p1.x, p1.y);
        console.log(p1);
    }

    renderTriangle(
        triangle: [number, number, number],
        projected: Array<Vector2>
    ) {
        this.drawTriangleWireframe(
            projected[triangle[0]],
            projected[triangle[1]],
            projected[triangle[2]],
            Color.blue.getHex()
        );
    }

    renderMesh(mesh: Mesh, transform: Transform) {
        if (this.camera == null) {
            console.warn("No camera!");
            return;
        }

        let projected: Array<Vector2> = [];
        mesh.vertices.forEach((v) => {
            if (this.camera)
                projected.push(
                    this.camera.transformToCamera(transform.apply(v), this)
                );
        });
        mesh.triangles.forEach((t) => {
            this.renderTriangle(t, projected);
        });
    }
}
