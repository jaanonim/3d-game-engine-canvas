import Component from "../../classes/Components/Component";

export default abstract class Collider extends Component {
    constructor() {
        super();
    }

    async start() {
        this.gameObject.getScene().colliders.registerCollider(this);
    }

    async onDestroy() {
        this.gameObject.getScene().colliders.removeCollider(this);
    }

    getCollisions(): Array<Collider> {
        const colliders = this.gameObject.getScene().colliders;
        const cols = colliders.colliders.filter((e) => e !== this);
        return cols.filter((c) => colliders.checkCollision(this, c));
    }
}
