import ClippingPlane from "../utilities/ClippingPlane";
import { degToRad, Sphere } from "../utilities/math/Math";
import Triangle from "../utilities/Triangle";
import Vector2 from "../utilities/math/Vector2";
import Vector3 from "../utilities/math/Vector3";
import Component from "../classes/Components/Component";
import Renderer from "../classes/Renderer";

export default class Camera extends Component {
    protected _viewportRatio: number;

    protected _near: number;
    public get near(): number {
        return this._near;
    }
    public set near(value: number) {
        this._near = value;
        this.updateFov();
    }

    protected _far: number;
    public get far(): number {
        return this._far;
    }
    public set far(value: number) {
        this._far = value;
        this.updateFov();
    }

    protected _viewportSize: Vector2;
    public get viewportSize(): Vector2 {
        return this._viewportSize;
    }

    protected _fov: number;
    public get fov(): number {
        return this._fov;
    }
    public set fov(value: number) {
        this._fov = value;
        this.updateFov();
    }

    public get scene() {
        return this.gameObject.getScene();
    }

    private _clip: boolean;

    clippingPlanes: [
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane
    ];

    constructor(
        renderer: Renderer,
        fov: number = 90,
        near: number = 1,
        far: number = 10000,
        clip: boolean = true
    ) {
        super();
        this._fov = fov;
        this._clip = clip;
        this._near = near;
        this._far = far;
        this._viewportRatio = renderer.canvasRatio;
        this._viewportSize = Vector2.zero;

        this.clippingPlanes = [
            new ClippingPlane(),
            new ClippingPlane(),
            new ClippingPlane(),
            new ClippingPlane(),
            new ClippingPlane(),
            new ClippingPlane(),
        ];

        renderer.onResize.addEventListener((args) => {
            this._viewportRatio = args.canvasRatio;
            this.updateFov();
        });
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
            -this._near
        );
        this.clippingPlanes[5] = new ClippingPlane(
            new Vector3(0, 0, -1),
            this._far
        );

        const x = Math.cos(angle);
        const y = Math.sin(angle);
        const a = this._viewportSize.y / 2;
        const z = a / Math.sqrt(a * a + this.near * this.near);
        const z2 = this.near / Math.sqrt(a * a + this.near * this.near);

        this.clippingPlanes[1] = new ClippingPlane(new Vector3(x, 0, y));
        this.clippingPlanes[2] = new ClippingPlane(new Vector3(-x, 0, y));
        this.clippingPlanes[3] = new ClippingPlane(new Vector3(0, z2, z));
        this.clippingPlanes[4] = new ClippingPlane(new Vector3(0, -z2, z));
    }

    preClipObject(boundingSphere: Sphere) {
        let res = 1;
        for (let i = 0; i < this.clippingPlanes.length; i++) {
            const p = this.clippingPlanes[i];
            const c_res = p.preClipObject(boundingSphere);
            if (c_res === -1) {
                return -1;
            }
            if (c_res === 0) {
                res = 0;
            }
        }
        return res;
    }

    clipObject(triangles: Array<Triangle>) {
        let resTriangles: Array<Triangle> | null = triangles;
        if (this._clip)
            for (let i = 0; i < this.clippingPlanes.length; i++) {
                resTriangles =
                    this.clippingPlanes[i].clipTriangles(resTriangles);
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

    transformNormalToCamera(vertex: Vector3) {
        const t = this.gameObject.transform.invert();
        return t.rotateVector(vertex);
    }

    projectVertex(vertex: Vector3, renderer: Renderer) {
        return renderer.viewportToCanvas(
            new Vector3(
                (vertex.x * this.near) / vertex.z,
                (vertex.y * this.near) / vertex.z,
                1 / vertex.z
            ),
            this
        );
    }

    screenPointToVector(v: Vector2, renderer: Renderer): Vector3 {
        const vec2 = renderer.canvasToViewport(v, this);
        return new Vector3(vec2.x, vec2.y, this._near);
    }

    /**
     * Transforms word global vector to spot where it's will be rendered
     * @param v word global vector
     * @param renderer
     * @returns Vector2 on screen
     */
    worldToScreenPoint(v: Vector3, renderer: Renderer): Vector2 {
        return renderer.scaleCanvasVector(
            this.projectVertex(this.transformToCamera(v), renderer).toVector2(),
            true
        );
    }

    getOriginalCoords(_v: Vector3, renderer: Renderer) {
        const v = renderer.getOriginalCoords(_v, this);
        return new Vector3(
            v.x / (this.near * v.z),
            v.y / (this.near * v.z),
            1 / v.z
        );
    }
}
