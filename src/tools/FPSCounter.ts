import Renderer from "../classes/Renderer";

export default class FPSCounter {
    html: HTMLElement;

    constructor(div: HTMLElement) {
        this.html = div;
    }

    update() {
        this.html.innerText =
            Math.round((1000 / Renderer.deltaTime) * 100) / 100 + "fps";
    }
}
