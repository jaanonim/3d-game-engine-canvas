import UiElement from "../../components/UiElement";
import Component from "./Component";
export default abstract class UiComponent extends Component {
    private _uiElement!: UiElement;
    public get uiElement(): UiElement {
        return this._uiElement;
    }

    async start() {
        const c = this.gameObject.getComponent<UiElement>(UiElement);
        if (!(c instanceof UiElement))
            throw Error(
                `Because game object '${this.gameObject.name}' don't have UiElement, cannot add UiComponent`
            );
        this._uiElement = c;
        await super.start();
        this.onActiveChanges.addEventListener(this.activeChanges.bind(this));
    }

    async onDestroy() {
        this.onActiveChanges.removeEventListener(this.activeChanges.bind(this));
    }

    activeChanges() {
        this.uiElement.canvas.clear();
    }

    uiRender() {
        // TODO: Move it so one game obj can renderer text and img
        if (!this.uiElement)
            throw Error(`Missing start call on ${this.gameObject.name}`);
        this.uiElement.canvas.clear();
    }
}
