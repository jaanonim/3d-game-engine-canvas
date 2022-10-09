import SizedComponent from "../classes/Components/SizedComponent";
import Renderer from "../classes/Renderer";
import Vector2 from "../utilities/math/Vector2";

export default class UiScreen extends SizedComponent {
    constructor(renderer: Renderer) {
        renderer.onResize.addEventListener((args) => {
            this.size = new Vector2(args.width, args.height);
        });
        super(new Vector2(renderer.canvas.width, renderer.canvas.height));
    }
}
