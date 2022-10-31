import Event from "../../classes/Event";
import Vector3 from "../../utilities/math/Vector3";
import Collider from "./Collider";

export default class SphereCollider extends Collider {
    private _radius: number;
    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
        this.onRadiusUpdates.call(this);
    }
    private _position: Vector3;
    public get position(): Vector3 {
        return this._position;
    }
    public set position(value: Vector3) {
        this._position = value;
        this.onPositionUpdates.call(this);
    }

    private _globalRadius: number;
    public get globalRadius(): number {
        return this._globalRadius;
    }

    private _globalPosition: Vector3;
    public get globalPosition(): Vector3 {
        return this._globalPosition;
    }

    onRadiusUpdates: Event<SphereCollider>;
    onPositionUpdates: Event<SphereCollider>;

    constructor(radius: number = 1, position: Vector3 = Vector3.zero) {
        super();
        this._radius = radius;
        this._globalRadius = radius;
        this._position = position;
        this._globalPosition = position;

        this.onRadiusUpdates = new Event<SphereCollider>();
        this.onPositionUpdates = new Event<SphereCollider>();

        this.onRadiusUpdates.addEventListener(
            this.updateGlobalRadius.bind(this)
        );
        this.onPositionUpdates.addEventListener(
            this.updateGlobalPosition.bind(this)
        );
    }

    async start() {
        super.start();
        this.transform.onSomeGlobalUpdates.addEventListener(
            this.onPositionUpdates.call.bind(this.onPositionUpdates, this)
        );
        this.transform.onGlobalScaleUpdates.addEventListener(
            this.onRadiusUpdates.call.bind(this.onRadiusUpdates, this)
        );
        this.onPositionUpdates.call(this);
        this.onRadiusUpdates.call(this);
    }

    updateGlobalPosition() {
        this._globalPosition = this.transform.apply(this._position);
    }

    updateGlobalRadius() {
        this._globalRadius =
            this._radius *
            Math.min(
                this.transform.globalScale.x,
                this.transform.globalScale.y,
                this.transform.globalScale.z
            );
    }
}
