import Component from "../classes/Component";
import Color from "../utilities/math/Color";

export enum LightType {
    AMBIENT = 0,
    DIRECTIONAL = 1,
    POINT = 2,
}

export default class Light extends Component {
    type: LightType;
    intensity: number;
    color: Color;

    constructor(type: LightType, intensity: number, color: Color) {
        super();
        this.type = type;
        this.intensity = intensity;
        this.color = color;
    }

    start() {
        this.gameObject.getScene().illumination.registerLight(this);
    }
}
