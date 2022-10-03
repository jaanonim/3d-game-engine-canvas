import ClippingPlane from "../utilities/ClippingPlane";
import Vector2 from "../utilities/math/Vector2";
import Vector3 from "../utilities/math/Vector3";
import Renderer from "../classes/Renderer";
import Camera from "./Camera";

export default class CameraOrthographic extends Camera {
    private _size: number;
    public get size(): number {
        return this._size;
    }
    public set size(value: number) {
        this._size = value;
        this.updateFov();
    }

    constructor(
        viewportRatio: number,
        size: number,
        near: number = 1,
        far: number = 10000
    ) {
        super(viewportRatio, 90, near, far);
        this._size = size;
    }

    updateFov() {
        this._viewportSize = new Vector2(
            this._size,
            this._size / this._viewportRatio
        );
        this.updateClippingPlanes();
    }

    updateClippingPlanes() {
        this.clippingPlanes[0] = new ClippingPlane(
            new Vector3(0, 0, 1),
            -this._near
        );
        this.clippingPlanes[5] = new ClippingPlane(
            new Vector3(0, 0, -1),
            this._far
        );
        this.clippingPlanes[1] = new ClippingPlane(
            new Vector3(1, 0, 0),
            this._viewportSize.x / 2
        );
        this.clippingPlanes[2] = new ClippingPlane(
            new Vector3(-1, 0, 0),
            this._viewportSize.x / 2
        );
        this.clippingPlanes[3] = new ClippingPlane(
            new Vector3(0, 1, 0),
            this._viewportSize.y / 2
        );
        this.clippingPlanes[4] = new ClippingPlane(
            new Vector3(0, -1, 0),
            this._viewportSize.y / 2
        );
    }

    projectVertex(vertex: Vector3, renderer: Renderer) {
        return renderer.viewportToCanvas(
            new Vector3(vertex.x, vertex.y, 1 / vertex.z)
        );
    }

    getOriginalCoords(_v: Vector3, renderer: Renderer) {
        const v = renderer.getOriginalCoords(_v);
        return new Vector3(v.x, v.y, 1 / v.z);
    }
}
