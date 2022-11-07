import SizedComponent from "../classes/Components/SizedComponent";
import Renderer, { onResizeArgs } from "../classes/Renderer";
import Vector2 from "../utilities/math/Vector2";
import Camera from "./Camera";

export default class UiScreen extends SizedComponent {
    layer: number;
    renderer: Renderer;
    scale: number;

    constructor(
        renderer: Renderer,
        scale: number,
        layer: number,
        smoothing: boolean = true
    ) {
        super({
            size: new Vector2(
                renderer.canvas.width * scale,
                renderer.canvas.height * scale
            ),
            smoothing: smoothing,
        });
        this.renderer = renderer;
        this.scale = scale;
        renderer.onResize.addEventListener(this.onResize.bind(this));
        this.layer = layer;
    }

    onResize(args: onResizeArgs) {
        this.size = new Vector2(
            args.width * this.scale,
            args.height * this.scale
        );
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
