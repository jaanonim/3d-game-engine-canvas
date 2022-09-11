import ClippingPlane from "../utilities/ClippingPlane";
import { degToRad, Sphere } from "../utilities/Math";
import Triangle from "../utilities/Triangle";
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
        const a = this._viewportSize.y / 2;
        const z = a / Math.sqrt(a * a + this.near * this.near);
        const z2 = this.near / Math.sqrt(a * a + this.near * this.near);
        console.log(x, y, z, z2);

        this.clippingPlanes[1] = new ClippingPlane(new Vector3(x, 0, y));
        this.clippingPlanes[2] = new ClippingPlane(new Vector3(-x, 0, y));
        this.clippingPlanes[3] = new ClippingPlane(new Vector3(0, z2, z));
        this.clippingPlanes[4] = new ClippingPlane(new Vector3(0, -z2, z));
    }

    clipObject(triangles: Array<Triangle>, boundingSphere: Sphere) {
        let resTriangles: Array<Triangle> | null = triangles;
        for (let i = 0; i < this.clippingPlanes.length; i++) {
            const p = this.clippingPlanes[i];
            resTriangles = p.clipObject(resTriangles, boundingSphere);
            console.log(i, resTriangles);
            if (resTriangles == null) {
                break;
            }
        }
        return resTriangles;
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
