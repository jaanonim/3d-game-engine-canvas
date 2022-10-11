import UiElement from "../../components/UiElement";
import Component from "./Component";
export default class UiComponent extends Component {
    uiElement!: UiElement;

    async start() {
        this.uiElement = this.gameObject.getComponent<UiElement>(UiElement);
        if (!(this.uiElement instanceof UiElement))
            throw Error(
                `Because game object '${this.gameObject.name}' don't have UiElement, cannot add UiComponent`
            );

        super.start();
    }

    uiRender() {
        this.uiElement.canvas.clear();
    }
}
