import Color from "../../utilities/math/Color";
import Texture from "../../utilities/Texture";
import Material from "./Material";

export default class TextureMaterial extends Material {
    texture: Texture | null;
    constructor(color: Color, texture?: Texture) {
        super(color);
        this.texture = texture ? texture : null;
    }
}
