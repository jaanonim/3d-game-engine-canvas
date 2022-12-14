import SizedComponent from "../classes/Components/SizedComponent";
import Box2D from "../utilities/math/Box2D";
import Vector2 from "../utilities/math/Vector2";
import Transform from "../utilities/Transform";

export default class UiElement extends SizedComponent {
    sizedParent!: SizedComponent;

    async start() {
        const parent = this.gameObject.transform.parent;
        if (parent instanceof Transform) {
            const c = parent.gameObject.getSizedComponent();
            if (!(c instanceof SizedComponent))
                throw Error(
                    `Because game object '${this.gameObject.name}' parent don't have component that have size, cannot add UiElement`
                );
            this.sizedParent = c;
        } else
            throw Error(
                `Because game object '${this.gameObject.name}' don't have parent or parent is Scene, cannot add UiElement`
            );
        super.start();
    }

    /**
     * Check if given vector is inside UiElement global box
     * @param v vector to check
     * @returns boolean
     */
    contains(v: Vector2): boolean {
        const s = this.realSize.divide(2);
        return new Box2D(
            this.realPosition.subtract(s),
            this.realPosition.add(s)
        ).contains(v);
    }
}
