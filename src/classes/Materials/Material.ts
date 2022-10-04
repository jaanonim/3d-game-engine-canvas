import Renderer from "../Renderer";
import Color from "../../utilities/math/Color";
import Triangle from "../../utilities/Triangle";
import Camera from "../../components/Camera";

export default class Material {
    color: Color;
    isTransparent: boolean;

    constructor(color: Color, isTransparent: boolean = false) {
        this.color = color;
        this.isTransparent = isTransparent;
    }

    renderTriangle(
        _triangle: Triangle,
        _originalTriangle: Triangle,
        _renderer: Renderer,
        _camera: Camera
    ) {}
}
