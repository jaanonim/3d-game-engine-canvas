import Triangle from "../../utilities/Triangle";
import Renderer from "../Renderer";
import Material from "./Material";

export default class WireframeMaterial extends Material {
    renderTriangle(
        triangle: Triangle,
        _originalTriangle: Triangle,
        renderer: Renderer
    ) {
        if (!triangle.hidden[0])
            renderer.drawer.drawLine(
                triangle.vertices[0],
                triangle.vertices[1],
                this.color,
                this.isTransparent
            );
        if (!triangle.hidden[1])
            renderer.drawer.drawLine(
                triangle.vertices[1],
                triangle.vertices[2],
                this.color,
                this.isTransparent
            );
        if (!triangle.hidden[2])
            renderer.drawer.drawLine(
                triangle.vertices[2],
                triangle.vertices[0],
                this.color,
                this.isTransparent
            );
    }
}
