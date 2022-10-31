import Event from "../../classes/Event";
import Vector3 from "../../utilities/math/Vector3";
import Collider from "./Collider";

/**
 * Basic box collider.
 * It is not effected by rotation (will be always perpendicular to axis).
 */
export default class BoxCollider extends Collider {
    private _a: Vector3;
    public get a(): Vector3 {
        return this._a;
    }
    public set a(value: Vector3) {
        this._a = value;
        this.onAUpdates.call(this);
    }

    private _b: Vector3;
    public get b(): Vector3 {
        return this._b;
    }
    public set b(value: Vector3) {
        this._b = value;
        this.onBUpdates.call(this);
    }

    private _globalA: Vector3;
    public get globalA(): Vector3 {
        return this._globalA;
    }

    private _globalB: Vector3;
    public get globalB(): Vector3 {
        return this._globalB;
    }

    onAUpdates: Event<BoxCollider>;
    onBUpdates: Event<BoxCollider>;

    constructor(a: Vector3 = Vector3.zero, b: Vector3 = Vector3.one) {
        super();
        this._a = a;
        this._b = b;
        this._globalA = a;
        this._globalB = b;

        this.onAUpdates = new Event<BoxCollider>();
        this.onBUpdates = new Event<BoxCollider>();

        this.onAUpdates.addEventListener(this.updateGlobalA.bind(this));
        this.onBUpdates.addEventListener(this.updateGlobalB.bind(this));
    }

    async start() {
        super.start();
        this.transform.onSomeGlobalUpdates.addEventListener(
            this.onAUpdates.call.bind(this.onAUpdates, this),
            this.onBUpdates.call.bind(this.onBUpdates, this)
        );

        this.onAUpdates.call(this);
        this.onBUpdates.call(this);
    }

    updateGlobalA() {
        this._globalA = this.transform.apply(this._a);
    }

    updateGlobalB() {
        this._globalB = this.transform.apply(this._b);
    }
}
