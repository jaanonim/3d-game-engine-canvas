import UiElement from "../../components/UiElement";
import Component from "./Component";
export default abstract class UiComponent extends Component {
    uiElement!: UiElement;

    async start() {
        const c = this.gameObject.getComponent<UiElement>(UiElement);
        if (!(c instanceof UiElement))
            throw Error(
                `Because game object '${this.gameObject.name}' don't have UiElement, cannot add UiComponent`
            );
        this.uiElement = c;
        super.start();
    }

    uiRender() {
        // TODO: Move it so one game obj can renderer text and img
        this.uiElement.canvas.clear();
    }
}
