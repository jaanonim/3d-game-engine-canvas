import Renderer from "../classes/Renderer";
import Texture from "../utilities/Texture";
import Camera from "./Camera";
import UiComponent from "../classes/Components/UiComponent";

export default class Image extends UiComponent {
    texture: Texture;

    constructor(texture: Texture) {
        super();
        this.texture = texture;
    }

    async start(): Promise<void> {}

    render(renderer: Renderer, camera: Camera) {}
}
