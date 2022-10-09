import SizedComponent from "../classes/Components/SizedComponent";
import GameObject from "../classes/GameObject";
import Transform from "../utilities/Transform";

export default class UiElement extends SizedComponent {
    sizedParent!: SizedComponent;

    register(obj: GameObject): void {
        const parent = obj.transform.parent;
        if (parent instanceof Transform) {
            this.sizedParent =
                parent.gameObject.getComponent<SizedComponent>(SizedComponent);
            if (!(this.sizedParent instanceof SizedComponent))
                throw Error(
                    `Because game object '${obj.name}' parent don't have component that have size, cannot add UiElement`
                );
        } else
            throw Error(
                `Because game object '${obj.name}' don't have parent or parent is Scene, cannot add UiElement`
            );
        super.register(obj);
    }
}
