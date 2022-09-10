import ClippingPlane from "../utilities/ClippingPlane";
import { degToRad } from "../utilities/Math";
import Mesh from "../utilities/Mesh";
import Vector2 from "../utilities/Vector2";
import Vector3 from "../utilities/Vector3";
import Component from "./Component";
import Renderer from "./Renderer";

export default class Camera extends Component {
    private _viewportRatio: number;

    private _near: number;
    public get near(): number {
        return this._near;
    }
    public set near(value: number) {
        this._near = value;
        this.updateFov();
    }

    private _viewportSize: Vector2;
    public get viewportSize(): Vector2 {
        return this._viewportSize;
    }

    private _fov: number;
    public get fov(): number {
        return this._fov;
    }
    public set fov(value: number) {
        this._fov = value;
        this.updateFov();
    }

    clippingPlanes: [
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane
    ];

    constructor(fov: number, near: number, viewportRatio: number) {
        super();
        this._fov = fov;
        this._near = near;
        this._viewportRatio = viewportRatio;
        this._viewportSize = Vector2.zero;

        this.clippingPlanes = [
            new ClippingPlane(),
            new ClippingPlane(),
            new ClippingPlane(),
            new ClippingPlane(),
            new ClippingPlane(),
        ];

        this._viewportSize = Vector2.zero;
        this._viewportRatio = viewportRatio;
        this.resize(viewportRatio);
    }

    resize(viewportRatio: number) {
        this._viewportRatio = viewportRatio;
        this.updateFov();
    }

    updateFov() {
        const angle = degToRad(this._fov / 2);
        const tg = Math.tan(angle);
        const x = 2 * this.near * tg;
        this._viewportSize = new Vector2(x, x / this._viewportRatio);
        this.updateClippingPlanes(angle);
    }

    updateClippingPlanes(angle: number) {
        this.clippingPlanes[0] = new ClippingPlane(
            new Vector3(0, 0, 1),
            this.near
        );

        const x = Math.cos(angle);
        const y = Math.sin(angle);

        this.clippingPlanes[1] = new ClippingPlane(new Vector3(x, 0, y));
        this.clippingPlanes[2] = new ClippingPlane(new Vector3(-x, 0, y));
        this.clippingPlanes[3] = new ClippingPlane(new Vector3(0, x, y));
        this.clippingPlanes[4] = new ClippingPlane(new Vector3(0, -x, y));
    }

    clipObject(mesh: Mesh) {
        let resMesh: Mesh | null = mesh;
        for (let i = 0; i < this.clippingPlanes.length; i++) {
            const p = this.clippingPlanes[i];
            resMesh = p.clipObject(mesh);
            if (resMesh == null) {
                break;
            }
        }
        return resMesh;
    }

    transformToCamera(vertex: Vector3) {
        const t = this.gameObject.transform.invert();
        return t.rotateVector(t.moveVector(vertex));
    }

    projectVertex(vertex: Vector3, renderer: Renderer) {
        return renderer.viewportToCanvas(
            new Vector2(
                (vertex.x * this.near) / vertex.z,
                (vertex.y * this.near) / vertex.z
            )
        );
    }
}