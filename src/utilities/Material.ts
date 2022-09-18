import Renderer from "../classes/Renderer";
import Color from "./Color";
import Triangle from "./Triangle";

export default class Material {
    color: Color;
    wireframe: boolean;

    constructor(color: Color, wireframe: boolean) {
        this.color = color;
        this.wireframe = wireframe;
    }

    renderTriangle(
        triangle: Triangle,
        originalTriangle: Triangle,
        renderer: Renderer
    ) {
        if (!renderer.scene) throw Error("No scene!");
        if (!renderer.camera) throw Error("No camera!");
        const [c, i] = renderer.scene.illumination.computeLighting(
            renderer.camera,
            originalTriangle.center(),
            originalTriangle.normal,
            10
        );

        if (this.wireframe) {
            renderer.drawer.drawTriangleWireframe(
                triangle.vertices[0],
                triangle.vertices[1],
                triangle.vertices[2],
                this.color
            );
        } else {
            renderer.drawer.drawTriangleFilled(
                triangle.vertices[0],
                triangle.vertices[1],
                triangle.vertices[2],
                this.color.multiply(c.normalize().multiply(i))
            );
        }
    }
}
