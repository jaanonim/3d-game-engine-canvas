import Triangle from "../../utilities/Triangle";
import Renderer from "../Renderer";
import Material from "./Material";

export default class WireframeMaterial extends Material {
    renderTriangle(
        triangle: Triangle,
        _originalTriangle: Triangle,
        renderer: Renderer
    ) {
        renderer.drawer.drawTriangleWireframe(triangle, this.color);
    }
}
