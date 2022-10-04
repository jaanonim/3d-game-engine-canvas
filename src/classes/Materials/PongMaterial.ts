import Camera from "../../components/Camera";
import CameraOrthographic from "../../components/CameraOrthographic";
import Color from "../../utilities/math/Color";
import Vector3 from "../../utilities/math/Vector3";
import Texture from "../../utilities/Texture";
import Triangle from "../../utilities/Triangle";
import Renderer from "../Renderer";
import TextureMaterial from "./TextureMaterial";

export default class PongMaterial extends TextureMaterial {
    specular: number;

    constructor(color: Color, specular: number, texture?: Texture) {
        super(color, texture);
        this.specular = specular;
    }

    renderTriangle(
        triangle: Triangle,
        _originalTriangle: Triangle,
        renderer: Renderer,
        camera: Camera
    ) {
        const ilu = camera.scene.illumination;

        const isOrthographic = camera instanceof CameraOrthographic;

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
                    triangle.verticesNormals[0],
                    isOrthographic
                        ? triangle.verticesUvs[0]
                        : triangle.verticesUvs[0].multiply(
                              triangle.vertices[0].z
                          ),
                ],
                [
                    triangle.vertices[1].z,
                    triangle.verticesNormals[1],
                    isOrthographic
                        ? triangle.verticesUvs[1]
                        : triangle.verticesUvs[1].multiply(
                              triangle.vertices[1].z
                          ),
                ],
                [
                    triangle.vertices[2].z,
                    triangle.verticesNormals[2],
                    isOrthographic
                        ? triangle.verticesUvs[2]
                        : triangle.verticesUvs[2].multiply(
                              triangle.vertices[2].z
                          ),
                ],
            ],
            (x, y, v) => {
                const z = v[0] as number;
                const normal = v[1] as Vector3;
                const uv = isOrthographic
                    ? (v[2] as Vector3)
                    : (v[2] as Vector3).multiply(1 / z);
                renderer.drawer.setPixelUsingDepthMap(
                    x,
                    y,
                    z,
                    this.isTransparent,
                    () => {
                        const pos = camera.getOriginalCoords(
                            new Vector3(x, y, z),
                            renderer
                        );
                        const [c, i] = ilu.computeLighting(
                            pos,
                            normal,
                            this.specular
                        );
                        let color = this.color.copy();
                        if (this.texture)
                            color = this.texture
                                .get(uv.x, uv.y, 0)
                                .multiply(color.normalize());
                        return color.multiply(c.normalize().multiply(i));
                    }
                );
            }
        );
    }
}
