import MeshRenderer from "../../components/MeshRenderer";

export default interface Raycasts {
    getCollisions(...args: any): Array<RaycastResult>;
}

export type RaycastResult = {
    meshRenderer: MeshRenderer;
    distance: number;
};
