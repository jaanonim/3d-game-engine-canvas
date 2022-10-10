import SizedComponent from "../classes/Components/SizedComponent";
import UiComponent from "../classes/Components/UiComponent";
import Renderer from "../classes/Renderer";
import Vector2 from "../utilities/math/Vector2";
import Camera from "./Camera";

export default class UiScreen extends SizedComponent {
    constructor(renderer: Renderer) {
        renderer.onResize.addEventListener((args) => {
            this.size = new Vector2(args.width, args.height);
        });
        super(new Vector2(renderer.canvas.width, renderer.canvas.height));
    }

    render(renderer: Renderer, _camera: Camera): void {
        this.gameObject.transform.children.map((t) =>
            t.gameObject.getComponent<UiComponent>(UiComponent).uiRender()
        );
        this.gameObject.transform.children.map((t) =>
            t.gameObject
                .getComponent<SizedComponent>(SizedComponent)
                .uiRender(this.canvas)
        );
        renderer.drawer.drawVirtualCanvas(this.canvas);
    }
}
