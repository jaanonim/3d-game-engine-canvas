import Color from "../../utilities/Color";
import Vector2 from "../../utilities/Vector2";

export default class Drawer {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    drawTriangleFilled(
        _p1: Vector2,
        _p2: Vector2,
        _p3: Vector2,
        _color: Color
    ) {}
    drawTriangleWireframe(
        _p1: Vector2,
        _p2: Vector2,
        _p3: Vector2,
        _color: Color
    ) {}
    begin() {}
    end() {}
}
