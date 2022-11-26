import Component from "../classes/Components/Component";
import GameObject from "../classes/GameObject";
import Scene from "../classes/Scene";
import Quaternion from "../utilities/Quaternion";
import Transform from "../utilities/Transform";
import Vector3 from "../utilities/math/Vector3";

export interface SceneData {
    name: string;
    children: Array<GameObjectType>;
}

export type GameObjectType = GameObjectData | GameObject;
export interface GameObjectData {
    name: string;
    transform?: TransformData;
    components?: Array<Component>;
    children?: Array<GameObjectType>;
}

export interface TransformData {
    position?: number[] | Vector3;
    rotation?: number[] | Vector3;
    scale?: number[] | Vector3;
}

export default class Importer {
    static async scene(data: SceneData): Promise<Scene> {
        const scene = new Scene(data.name);
        const objs = await Promise.all(
            data.children.map((o) => Importer.object(o))
        );
        await Promise.all(
            objs.map((o) => {
                scene.addChildren(o);
            })
        );
        return scene;
    }

    static async object(data: GameObjectType): Promise<GameObject>;
    static async object(
        data: Array<GameObjectType>
    ): Promise<Array<GameObject>>;
    static async object(data: GameObjectType | Array<GameObjectType>) {
        if (data instanceof GameObject) return data;
        if (Array.isArray(data))
            return Promise.all(data.map((o) => Importer.object(o)));

        const obj = new GameObject(data.name);

        if (data.transform)
            obj.transform = Importer.transform(data.transform, obj);

        if (data.components)
            data.components.forEach((c) => {
                obj.addComponent(c);
            });

        if (data.children) {
            const objs = await Promise.all(
                data.children.map((o) => Importer.object(o))
            );
            await Promise.all(
                objs.map((o) => {
                    obj.addChildren(o);
                })
            );
        }

        return obj;
    }

    //* Maybe added later
    // static component(data: ComponentData): Component {
    //     for (const [key, value] of Object.entries(COMPONENTS)) {
    //         if (key === data.name) {
    //             //return new value();
    //         }
    //     }
    //     throw Error(`Component ${data.name} not found`);
    // }

    static transform(data: TransformData, obj: GameObject): Transform {
        const t = new Transform(
            obj,
            data.position ? Importer.vector3(data.position) : undefined,
            data.rotation
                ? Quaternion.euler(Importer.vector3(data.rotation))
                : undefined,
            data.scale ? Importer.vector3(data.scale) : undefined
        );
        return t;
    }

    static vector3(data: number[] | Vector3): Vector3 {
        if (data instanceof Vector3) return data;
        if (data.length !== 3) throw Error("Invalid Vector3");
        return new Vector3(data[0], data[1], data[2]);
    }
}
