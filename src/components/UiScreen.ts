import SizedComponent from "../classes/Components/SizedComponent";
import Renderer, { onResizeArgs } from "../classes/Renderer";
import Vector2 from "../utilities/math/Vector2";
import Camera from "./Camera";

export default class UiScreen extends SizedComponent {
    layer: number;
    renderer: Renderer;

    constructor(renderer: Renderer, layer: number, smoothing: boolean = true) {
        super(
            new Vector2(renderer.canvas.width, renderer.canvas.height),
            undefined,
            undefined,
            undefined,
            undefined,
            smoothing
        );
        this.renderer = renderer;
        renderer.onResize.addEventListener(this.onResize.bind(this));
        this.layer = layer;
    }

    onResize(args: onResizeArgs) {
        this.size = new Vector2(args.width, args.height);
    }

    render(renderer: Renderer, _camera: Camera): void {
        this.canvas.clear();
        this.gameObject.transform.children.forEach((t) =>
            t.gameObject.getSizedComponent()?.uiRender(this.canvas)
        );
        renderer.drawer.drawVirtualCanvas(this.canvas, this.layer);
    }

    async onDestroy() {
        this.renderer.onResize.removeEventListener(this.onResize.bind(this));
    }
}
