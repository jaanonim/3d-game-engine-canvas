import Renderer from "../Renderer";
import Color from "../../utilities/Color";
import Triangle from "../../utilities/Triangle";

export default class Material {
    color: Color;

    constructor(color: Color) {
        this.color = color;
    }

    renderTriangle(
        _triangle: Triangle,
        _originalTriangle: Triangle,
        _renderer: Renderer
    ) {}
}
