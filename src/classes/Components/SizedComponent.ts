import Component from "./Component";
import Vector2 from "../../utilities/math/Vector2";

export default abstract class SizedComponent extends Component {
    size: Vector2;

    constructor(size: Vector2 = Vector2.one.multiply(100)) {
        super();
        this.size = size;
    }
}
