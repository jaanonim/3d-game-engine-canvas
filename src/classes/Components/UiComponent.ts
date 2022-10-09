import GameObject from "../classes/GameObject";
import Component from "./Component";
import UiElement from "../components/UiElement";

export default class UiComponent extends Component {
    uiElement!: UiElement;
    register(obj: GameObject): void {
        this.uiElement = this.gameObject.getComponent<UiElement>(UiElement);
        if (!(this.uiElement instanceof UiElement))
            throw Error(
                `Because game object '${obj.name}' don't have UiElement, cannot add UiComponent`
            );

        super.register(obj);
    }
}
