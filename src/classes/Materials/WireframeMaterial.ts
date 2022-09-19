import Triangle from "../../utilities/Triangle";
import Renderer from "../Renderer";
import Material from "./Material";

export default class WireframeMaterial extends Material {
    renderTriangle(
        triangle: Triangle,
        _originalTriangle: Triangle,
        renderer: Renderer
    ) {
        renderer.drawer.drawTriangleWireframe(
            triangle.vertices[0],
            triangle.vertices[1],
            triangle.vertices[2],
            this.color
        );
    }
}
