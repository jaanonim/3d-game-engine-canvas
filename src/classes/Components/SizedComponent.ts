import Component from "./Component";
import Vector2 from "../../utilities/math/Vector2";
import VirtualCanvas from "../../utilities/VirtualCanvas";

export default abstract class SizedComponent extends Component {
    size: Vector2;
    canvas: VirtualCanvas;

    constructor(size: Vector2 = Vector2.one.multiply(100)) {
        super();
        this.size = size;
        this.canvas = new VirtualCanvas(size.x, size.y);
    }

    uiRender(canvas: VirtualCanvas) {
        this.gameObject.transform.children.map((t) =>
            t.gameObject
                .getComponent<SizedComponent>(SizedComponent)
                .uiRender(this.canvas)
        );

        canvas.ctx.drawImage(
            this.canvas.canvas,
            this.gameObject.transform.position.x,
            this.gameObject.transform.position.y
        );
    }
}
