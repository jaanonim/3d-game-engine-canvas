import Renderer from "../classes/Renderer";
import Material from "./Material";
import Triangle from "./Triangle";

export default class GouraudMaterial extends Material {
    renderTriangle(
        triangle: Triangle,
        originalTriangle: Triangle,
        renderer: Renderer
    ) {
        if (!renderer.scene) throw Error("No scene!");
        if (!renderer.camera) throw Error("No camera!");

        const [c1, i1] = renderer.scene.illumination.computeLighting(
            renderer.camera,
            originalTriangle.vertices[0],
            originalTriangle.normal,
            10
        );

        const [c2, i2] = renderer.scene.illumination.computeLighting(
            renderer.camera,
            originalTriangle.vertices[1],
            originalTriangle.normal,
            10
        );

        const [c3, i3] = renderer.scene.illumination.computeLighting(
            renderer.camera,
            originalTriangle.vertices[2],
            originalTriangle.normal,
            10
        );

        renderer.drawer.drawTriangleFilledShaded(
            triangle.vertices[0],
            triangle.vertices[1],
            triangle.vertices[2],
            this.color.multiply(c1.normalize().multiply(i1)),
            this.color.multiply(c2.normalize().multiply(i2)),
            this.color.multiply(c3.normalize().multiply(i3))
        );
    }
}
