import Component from "../classes/Component";
import GameObject from "../classes/GameObject";

export enum LightType {
    AMBIENT = 0,
    DIRECTIONAL = 1,
    POINT = 2,
}

export default class Light extends Component {
    type: LightType;
    intensity: number;

    constructor(type: LightType, intensity: number) {
        super();
        this.type = type;
        this.intensity = intensity;
    }

    register(obj: GameObject): void {
        super.register(obj);
        this.gameObject.getScene().illumination.registerLight(this);
    }
}
