import SizedComponent from "../classes/Components/SizedComponent";
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
}
