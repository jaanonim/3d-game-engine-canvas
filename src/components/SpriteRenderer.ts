import Texture from "../utilities/Texture";
import BasicMaterial from "../classes/Materials/BasicMaterial";
import Color from "../utilities/math/Color";
import DefaultMeshes from "../tools/DefaultMeshes";
import MeshRenderer from "./MeshRenderer";

export default class SpriteRenderer extends MeshRenderer {
    constructor(texture: Texture, color: Color) {
        super(DefaultMeshes.plane, new BasicMaterial(color, texture, true));
    }
}
