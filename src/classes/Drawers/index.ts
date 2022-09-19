import Color from "../../utilities/math/Color";
import Vector3 from "../../utilities/math/Vector3";
import Renderer from "../Renderer";

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
        _p1: Vector3,
        _p2: Vector3,
        _p3: Vector3,
        _color: Color
    ) {}
    drawTriangleWireframe(
        _p1: Vector3,
        _p2: Vector3,
        _p3: Vector3,
        _color: Color
    ) {}
    drawTriangleFilledShaded(
        _p1: Vector3,
        _p2: Vector3,
        _p3: Vector3,
        _color1: Color,
        _color2: Color,
        _color3: Color
    ) {}

    drawTriangleFiledPong(
        _p1: Vector3,
        _p2: Vector3,
        _p3: Vector3,
        _normal1: Vector3,
        _normal2: Vector3,
        _normal3: Vector3,
        _color: Color,
        _specular: number,
        _renderer: Renderer
    ) {}

    begin() {}
    end() {}
}
