import Camera from "./classes/Camera";
import Component from "./classes/Component";
import GameObject from "./classes/GameObject";
import Renderer from "./classes/Renderer";
import MeshRenderer from "./components/MeshRenderer";
import "./style.css";
import FPSCounter from "./tools/FPSCounter";
import Importer from "./tools/Importer";
import Mesh from "./utilities/Mesh";
import Quaternion from "./utilities/Quaternion";
import Vector3 from "./utilities/Vector3";

class Rotate extends Component {
    v: number;
    rotation: Vector3;

    constructor(rotation: Vector3) {
        super();
        this.v = 0;
        this.rotation = rotation;
    }

    update(): void {
        this.gameObject.transform.rotation = Quaternion.euler(
            this.rotation.multiply(this.v)
        );
        this.v += 0.1;
    }
}

const mesh = new Mesh(
    [
        new Vector3(1, 1, 1),
        new Vector3(-1, 1, 1),
        new Vector3(-1, -1, 1),
        new Vector3(1, -1, 1),
        new Vector3(1, 1, -1),
        new Vector3(-1, 1, -1),
        new Vector3(-1, -1, -1),
        new Vector3(1, -1, -1),
    ],
    [
        [0, 1, 2],
        [0, 2, 3],
        [4, 0, 3],
        [4, 3, 7],
        [5, 4, 7],
        [5, 7, 6],
        [1, 6, 2],
        [4, 5, 1],
        [4, 1, 0],
        [2, 6, 7],
        [2, 7, 3],
    ]
);

const data = {
    name: "scene",
    children: [
        {
            name: "r",
            transform: {
                position: [10, 0, 0],
                scale: [1, 2, 3],
            },
            components: [new MeshRenderer(mesh)],
        },
        {
            name: "l",
            transform: {
                position: [-10, 0, 0],
                scale: [1, 2, 3],
            },
            components: [new MeshRenderer(mesh)],
        },
        {
            name: "g",
            transform: {
                position: [-2, -3, 30],
                scale: [0.5, 0.5, 0.5],
            },
            children: [
                {
                    name: "cube",
                    transform: {
                        position: [1, 1, 1],
                    },
                    components: [new MeshRenderer(mesh)],
                },
            ],
            components: [new Rotate(new Vector3(1, 1, 1))],
        },
    ],
};

const scene = Importer.scene(data);

const canvas = document.getElementById("root") as HTMLCanvasElement;

const cam = new GameObject("cam");
cam.addComponent(new Rotate(new Vector3(0, 0.1, 0)));
scene.addChildren(cam);

const r = new Renderer(canvas);
r.setCamera(cam.addComponent(new Camera(90, 1, r.canvasRatio)) as Camera);
r.setScene(scene);

const fps = new FPSCounter(document.getElementById("fps") as HTMLElement);
// r.render();

let t = 0;
r.startGameLoop(() => {
    if (t > 0.2) {
        fps.update();
        t = 0;
    }
    t += Renderer.deltaTime;
});
