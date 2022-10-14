import GameObject from "../classes/GameObject";
import Scene from "../classes/Scene";
import Quaternion from "./Quaternion";
import Vector3 from "./math/Vector3";
import Event from "../classes/Event";

export default class Transform {
    gameObject: GameObject;
    onGlobalPositionUpdates: Event<Transform>;
    onGlobalRotationUpdates: Event<Transform>;
    onGlobalScaleUpdates: Event<Transform>;
    onSomeGlobalUpdates: Event<Transform>;

    private _parent: Transform | Scene | undefined;
    private _children: Array<Transform>;
    public get children(): Array<Transform> {
        return this._children;
    }
    public get parent(): Transform | Scene | undefined {
        return this._parent;
    }

    private _scale: Vector3;
    public get scale(): Vector3 {
        return this._scale;
    }
    public set scale(value: Vector3) {
        this._scale = value;
        this.onGlobalScaleUpdates.call(this);
    }

    private _position: Vector3;
    public get position(): Vector3 {
        return this._position;
    }
    public set position(value: Vector3) {
        this._position = value;
        this.onGlobalPositionUpdates.call(this);
    }

    private _rotation: Quaternion;
    public get rotation(): Quaternion {
        return this._rotation;
    }
    public set rotation(value: Quaternion) {
        this._rotation = value;
        this.onGlobalRotationUpdates.call(this);
    }

    private _globalRotation!: Quaternion;
    public get globalRotation(): Quaternion {
        return this._globalRotation;
    }

    private _globalScale!: Vector3;
    public get globalScale(): Vector3 {
        return this._globalScale;
    }

    private _globalPosition!: Vector3;
    public get globalPosition(): Vector3 {
        return this._globalPosition;
    }

    constructor(
        gameObject: GameObject,
        position: Vector3 = Vector3.zero,
        rotation: Quaternion = new Quaternion(),
        scale: Vector3 = Vector3.one
    ) {
        this.gameObject = gameObject;
        this._scale = scale;
        this._rotation = rotation;
        this._position = position;
        this._parent = undefined;
        this._children = [];
        this.onGlobalPositionUpdates = new Event<Transform>();
        this.onGlobalRotationUpdates = new Event<Transform>();
        this.onGlobalScaleUpdates = new Event<Transform>();
        this.onSomeGlobalUpdates = new Event<Transform>();

        this.updateGlobalScale();
        this.updateGlobalRotation();
        this.updateGlobalPosition();

        this.onGlobalPositionUpdates.addEventListener(
            this.updateGlobalPosition.bind(this),
            this.onSomeGlobalUpdates.call.bind(this.onSomeGlobalUpdates)
        );
        this.onGlobalRotationUpdates.addEventListener(
            this.updateGlobalRotation.bind(this),
            this.onSomeGlobalUpdates.call.bind(this.onSomeGlobalUpdates)
        );
        this.onGlobalScaleUpdates.addEventListener(
            this.updateGlobalScale.bind(this),
            this.onSomeGlobalUpdates.call.bind(this.onSomeGlobalUpdates)
        );
        this.updateAll();
    }

    apply(vector: Vector3) {
        return this.moveVector(this.rotateVector(this.scaleVector(vector)));
    }

    /**
     *   Children and parent fields will be empty on returned object.
     */
    invert() {
        return new Transform(
            this.gameObject,
            this.position.invert(),
            this.rotation.invert(),
            this.scale.invert()
        );
    }

    scaleVector(vector: Vector3) {
        return vector.multiply(this.globalScale);
    }

    rotateVector(vector: Vector3) {
        return this.globalRotation.multiply(vector) as Vector3;
    }

    moveVector(vector: Vector3) {
        return vector.add(this.globalPosition);
    }

    addChildren(transform: Transform) {
        this._children.push(transform);
        transform._parent = this;
        transform.updateAll();
        return transform;
    }

    setParent(scene: Scene) {
        this._parent = scene;
    }

    updateAll() {
        this.onGlobalScaleUpdates.call(this);
        this.onGlobalRotationUpdates.call(this);
        this.onGlobalPositionUpdates.call(this);
    }

    updateGlobalRotation(): void {
        if (!(this.parent instanceof Transform))
            this._globalRotation = this.rotation;
        else
            this._globalRotation = this.rotation.multiply(
                this.parent.globalRotation
            ) as Quaternion;
        this._children.forEach((t) => {
            t.updateAll();
        });
    }

    updateGlobalScale(): void {
        if (!(this.parent instanceof Transform)) this._globalScale = this.scale;
        else this._globalScale = this.scale.multiply(this.parent.globalScale);
        this._children.forEach((t) => {
            t.updateAll();
        });
    }

    updateGlobalPosition(): void {
        if (!(this.parent instanceof Transform))
            this._globalPosition = this.position;
        else this._globalPosition = this.parent.apply(this.position);

        this._children.forEach((t) => {
            t.updateAll();
        });
    }
}
