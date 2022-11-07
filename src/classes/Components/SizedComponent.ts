import Component from "./Component";
import Vector2 from "../../utilities/math/Vector2";
import VirtualCanvas from "../../utilities/VirtualCanvas";
import Transform from "../../utilities/Transform";
import Event from "../Event";

export enum SizeType {
    PIXEL,
    PERCENTAGE,
}

export enum PositionType {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    CENTER_LEFT,
    CENTER_CENTER,
    CENTER_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT,
}

export interface sizedComponentOptions {
    size?: Vector2;
    rotation?: number;
    sizeType?: SizeType;
    positionType?: PositionType;
    anchor?: Vector2;
    flip?: [boolean, boolean];
    smoothing?: boolean;
}

export default abstract class SizedComponent extends Component {
    canvas: VirtualCanvas;
    smoothing: boolean;

    private _rotation: number;
    public get rotation(): number {
        return this._rotation;
    }
    public set rotation(value: number) {
        this._rotation = value;
        this.onRotationUpdate.call(this);
    }

    private _size: Vector2;
    public get size(): Vector2 {
        return this._size;
    }
    public set size(value: Vector2) {
        this._size = value;
        this.onSizeUpdate.call(this);
    }

    private _anchor: Vector2;
    public get anchor(): Vector2 {
        return this._anchor;
    }
    public set anchor(value: Vector2) {
        this._anchor = value.normalize();
        this.onAnchorUpdate.call(this);
    }

    private _realSize: Vector2;
    public get realSize(): Vector2 {
        return this._realSize;
    }

    private _realPosition: Vector2;
    public get realPosition(): Vector2 {
        return this._realPosition;
    }

    private _sizeType: SizeType;
    public get sizeType(): SizeType {
        return this._sizeType;
    }
    public set sizeType(value: SizeType) {
        this._sizeType = value;
        this.onSizeUpdate.call(this);
    }

    private _positionType: PositionType;
    public get positionType(): PositionType {
        return this._positionType;
    }
    public set positionType(value: PositionType) {
        this._positionType = value;
        this.onPositionUpdate.call(this);
    }

    private _flip: [boolean, boolean];
    public get flip(): [boolean, boolean] {
        return this._flip;
    }
    public set flip(value: [boolean, boolean]) {
        this._flip = value;
        this.onFlipUpdate.call(this);
    }

    onSizeUpdate: Event<SizedComponent>;
    onPositionUpdate: Event<SizedComponent>;
    onRotationUpdate: Event<SizedComponent>;
    onAnchorUpdate: Event<SizedComponent>;
    onSomeUpdate: Event<SizedComponent>;
    onFlipUpdate: Event<SizedComponent>;

    constructor(options: sizedComponentOptions) {
        super();
        this._size = options.size || Vector2.one.multiply(100);
        this._realSize = this.size;
        this._realPosition = Vector2.zero;
        this._sizeType = options.sizeType || SizeType.PIXEL;
        this._positionType = options.positionType || PositionType.TOP_LEFT;
        this._anchor = options.anchor || new Vector2(0.5, 0.5);
        this._rotation = options.rotation || 0;
        this._flip = options.flip || [false, false];
        this.smoothing = options.smoothing || true;
        this.onSizeUpdate = new Event<SizedComponent>();
        this.onPositionUpdate = new Event<SizedComponent>();
        this.onRotationUpdate = new Event<SizedComponent>();
        this.onAnchorUpdate = new Event<SizedComponent>();
        this.onSomeUpdate = new Event<SizedComponent>();
        this.onFlipUpdate = new Event<SizedComponent>();
        this.canvas = new VirtualCanvas(
            this.size.x,
            this.size.y,
            this.smoothing
        );
    }

    async start() {
        this.onSizeUpdate.addEventListener(
            this.updateSize.bind(this),
            this.onSomeUpdate.call.bind(this.onSomeUpdate, this)
        );
        this.transform.onGlobalScaleUpdates.addEventListener(
            this.onSizeUpdate.call.bind(this.onSizeUpdate, this)
        );

        this.onPositionUpdate.addEventListener(
            this.updatePosition.bind(this),
            this.onSomeUpdate.call.bind(this.onSomeUpdate, this)
        );
        this.transform.onPositionUpdates.addEventListener(
            this.onPositionUpdate.call.bind(this.onPositionUpdate, this)
        );

        this.onAnchorUpdate.addEventListener(
            this.onSomeUpdate.call.bind(this.onSomeUpdate, this)
        );
        this.onRotationUpdate.addEventListener(
            this.onSomeUpdate.call.bind(this.onSomeUpdate, this)
        );
        this.onFlipUpdate.addEventListener(
            this.onSomeUpdate.call.bind(this.onSomeUpdate, this)
        );

        this.onSizeUpdate.call(this);
        this.onPositionUpdate.call(this);
        this.onRotationUpdate.call(this);
        this.onAnchorUpdate.call(this);
        this.onFlipUpdate.call(this);
    }

    updatePosition() {
        const transformPos = this.transform.position.toVector2();
        if (this.positionType === PositionType.TOP_LEFT) {
            this._realPosition = transformPos;
            return;
        } else {
            const p = this.transform.parent;
            if (!(p instanceof Transform))
                throw Error(
                    "Game Object with SizedComponent doesn't have parent with Transform"
                );
            const relativeSize = p.gameObject.getSizedComponent()?.realSize;
            if (!relativeSize)
                throw Error(
                    "Game Object with SizedComponent doesn't have parent with SizedComponent"
                );
            switch (this.positionType) {
                case PositionType.TOP_CENTER:
                    this._realPosition = transformPos.add(
                        new Vector2(relativeSize.x / 2, 0)
                    );
                    break;
                case PositionType.TOP_RIGHT:
                    this._realPosition = transformPos.add(
                        new Vector2(relativeSize.x, 0)
                    );
                    break;

                case PositionType.CENTER_LEFT:
                    this._realPosition = transformPos.add(
                        new Vector2(0, relativeSize.y / 2)
                    );
                    break;
                case PositionType.CENTER_CENTER:
                    this._realPosition = transformPos.add(
                        new Vector2(relativeSize.x / 2, relativeSize.y / 2)
                    );
                    break;
                case PositionType.CENTER_RIGHT:
                    this._realPosition = transformPos.add(
                        new Vector2(relativeSize.x, relativeSize.y / 2)
                    );
                    break;

                case PositionType.BOTTOM_LEFT:
                    this._realPosition = transformPos.add(
                        new Vector2(0, relativeSize.y)
                    );
                    break;
                case PositionType.BOTTOM_CENTER:
                    this._realPosition = transformPos.add(
                        new Vector2(relativeSize.x / 2, relativeSize.y)
                    );
                    break;
                case PositionType.BOTTOM_RIGHT:
                    this._realPosition = transformPos.add(
                        new Vector2(relativeSize.x, relativeSize.y)
                    );
                    break;
            }
        }
    }

    updateSize() {
        if (this.sizeType === SizeType.PIXEL)
            this._realSize = this.size.multiply(
                this.transform.globalScale.toVector2()
            );
        else {
            const p = this.transform.parent;
            if (!(p instanceof Transform))
                throw Error(
                    "Game Object with SizedComponent doesn't have parent with Transform"
                );
            const relativeSize = p.gameObject.getSizedComponent()?.realSize;
            if (!relativeSize)
                throw Error(
                    "Game Object with SizedComponent doesn't have parent with SizedComponent"
                );
            if (this.sizeType === SizeType.PERCENTAGE) {
                this._realSize = relativeSize
                    .multiply(this.size.divide(100))
                    .multiply(this.transform.globalScale.toVector2());
            }
        }
        this.canvas = new VirtualCanvas(
            this.realSize.x,
            this.realSize.y,
            this.smoothing
        );
    }

    uiRender(canvas: VirtualCanvas) {
        this.canvas.clear();

        this.transform.gameObject.getUiComponents().forEach((c) => {
            if (c.isActive) c.uiRender();
        });
        this.transform.children.map((t) =>
            t.gameObject.getSizedComponent()?.uiRender(this.canvas)
        );

        const s = this._anchor
            .multiply(new Vector2(this.canvas.width, this.canvas.height))
            .roundToInt();
        const p = this.realPosition.subtract(s);

        canvas.ctx.save();
        canvas.ctx.translate(p.x + s.x, p.y + s.y);
        canvas.ctx.rotate(this._rotation);
        canvas.ctx.scale(this._flip[0] ? -1 : 1, this._flip[1] ? -1 : 1);
        canvas.ctx.translate(-p.x - s.x, -p.y - s.y);

        canvas.ctx.drawImage(
            this.canvas.canvas,
            p.x,
            p.y,
            this.canvas.canvas.width,
            this.canvas.canvas.height
        );
        canvas.ctx.restore();
    }
}
