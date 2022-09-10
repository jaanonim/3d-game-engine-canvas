import { degToRad } from "../utilities/Math";
import Vector2 from "../utilities/Vector2";
import Vector3 from "../utilities/Vector3";
import Component from "./Component";
import Renderer from "./Renderer";

export default class Camera extends Component {
    _d: number;

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

    constructor(fov: number, viewportRatio: number) {
        super();
        this._fov = fov;
        this._d = 0;
        this._viewportSize = Vector2.zero;
        this.resize(viewportRatio);
    }

    resize(viewportRatio: number) {
        this._viewportSize = new Vector2(viewportRatio, 1);
        this.updateFov();
    }

    updateFov() {
        this._d =
            ((1 / Math.tan(degToRad(this._fov / 2))) * this._viewportSize.x) /
            2;
    }

    transformToCamera(vertex: Vector3, renderer: Renderer) {
        const t = this.gameObject.transform.invert();
        return this.projectVertex(
            t.rotateVector(t.moveVector(vertex)),
            renderer
        );
    }

    projectVertex(vertex: Vector3, renderer: Renderer) {
        return renderer.viewportToCanvas(
            new Vector2(
                (vertex.x * this._d) / vertex.z,
                (vertex.y * this._d) / vertex.z
            )
        );
    }
}
