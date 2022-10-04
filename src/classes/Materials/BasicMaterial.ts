import Camera from "../../components/Camera";
import Color from "../../utilities/math/Color";
import Vector3 from "../../utilities/math/Vector3";
import Texture from "../../utilities/Texture";
import Triangle from "../../utilities/Triangle";
import Renderer from "../Renderer";
import TextureMaterial from "./TextureMaterial";

export default class BasicMaterial extends TextureMaterial {
    constructor(
        color: Color,
        texture?: Texture,
        isTransparent: boolean = false
    ) {
        super(color, texture, isTransparent);
    }

    renderTriangle(
        triangle: Triangle,
        _originalTriangle: Triangle,
        renderer: Renderer,
        _camera: Camera
    ) {
        renderer.drawer.basicTriangle(
            [
                triangle.vertices[0].x,
                triangle.vertices[1].x,
                triangle.vertices[2].x,
            ],
            [
                triangle.vertices[0].y,
                triangle.vertices[1].y,
                triangle.vertices[2].y,
            ],
            [
                [
                    triangle.vertices[0].z,
                    triangle.verticesUvs[0].multiply(triangle.vertices[0].z),
                ],
                [
                    triangle.vertices[1].z,
                    triangle.verticesUvs[1].multiply(triangle.vertices[1].z),
                ],
                [
                    triangle.vertices[2].z,
                    triangle.verticesUvs[2].multiply(triangle.vertices[2].z),
                ],
            ],
            (x, y, v) => {
                const z = v[0] as number;
                const uv = v[1] as Vector3;

                renderer.drawer.setPixelUsingDepthMap(
                    x,
                    y,
                    z,
                    this.isTransparent,
                    () =>
                        this.texture
                            ? this.texture
                                  .get(uv.x / z, uv.y / z)
                                  .multiply(this.color.copy().normalize())
                            : this.color.copy()
                );
            }
        );
    }
}
