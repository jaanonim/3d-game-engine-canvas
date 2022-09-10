import Color from "../utilities/Color";
import Mesh from "../utilities/Mesh";
import Transform from "../utilities/Transform";
import { Triangle2D } from "../utilities/Triangle";
import Vector2 from "../utilities/Vector2";
import Camera from "./Camera";
import Scene from "./Scene";

export default class Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    camera: Camera | null;
    scene: Scene | null;

    canvasRatio: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.onresize = this.resize;
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
    }

    renderTriangle(triangle: Triangle2D) {
        this.drawTriangleWireframe(
            triangle.vertices[0],
            triangle.vertices[1],
            triangle.vertices[2],
            Color.blue.getHex()
        );
    }

    renderMesh(mesh: Mesh, transform: Transform) {
        if (this.camera) {
            const clippedMesh = this.camera.clipObject(
                mesh.project(this.camera, transform)
            );
            console.log(clippedMesh);
            if (!clippedMesh) return;
            const triangles = clippedMesh.toArrayOfTriangles();

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
