import Camera from "./classes/Camera";
import Component from "./classes/Component";
import GameObject from "./classes/GameObject";
import Renderer from "./classes/Renderer";
import MeshRenderer from "./components/MeshRenderer";
import "./style.css";
import FileLoader from "./tools/FileLoader";
import FPSCounter from "./tools/FPSCounter";
import Importer from "./tools/Importer";
import ObjLoader from "./tools/ObjLoader";
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

const teapot = new ObjLoader(await FileLoader.load("/teapot.obj")).parse();

const cube = new Mesh(
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

const triangle = new Mesh(
    [new Vector3(1, 1, 1), new Vector3(-1, 1, 1), new Vector3(-1, -1, 1)],
    [[0, 1, 2]]
);

const data = {
    name: "scene",
    children: [
        // {
        //     name: "o",
        //     transform: {
        //         position: [11, 0, 10],
        //         rotation: [0, 0, 0],
        //         scale: [1, 1, 1],
        //     },
        //     components: [
        //         new MeshRenderer(triangle),
        //         //new Rotate(new Vector3(0, 0.1, 0)),
        //     ],
        // },
        {
            name: "r",
            transform: {
                position: [10, 0, 0],
                scale: [1, 2, 3],
            },
            components: [new MeshRenderer(cube)],
        },
        {
            name: "l",
            transform: {
                position: [-10, 0, 0],
                scale: [1, 2, 3],
            },
            components: [new MeshRenderer(cube)],
        },
        {
            name: "g",
            transform: {
                position: [0, 0, 6],
                scale: [0.5, 0.5, 0.5],
            },
            children: [
                {
                    name: "cube",
                    transform: {
                        position: [1, 1, 1],
                        scale: [1.5, 1.5, 1.5],
                    },
                    components: [new MeshRenderer(teapot)],
                },
            ],
            components: [new Rotate(new Vector3(0.1, 0.1, 0.1))],
        },
    ],
};

const scene = Importer.scene(data);

const canvas = document.getElementById("root") as HTMLCanvasElement;

const cam = new GameObject("cam");
//cam.addComponent(new Rotate(new Vector3(0, 0.1, 0)));
cam.transform.rotation = Quaternion.euler(new Vector3(0, 0.7, 0));
scene.addChildren(cam);

const r = new Renderer(canvas);
r.setCamera(cam.addComponent(new Camera(90, 1, r.canvasRatio)) as Camera);
r.setScene(scene);

const fps = new FPSCounter(document.getElementById("fps") as HTMLElement);
r.render();

let t = 0;
let i = 0;
setInterval(() => {
    console.log(t / i);
}, 10000);
r.startGameLoop(() => {
    fps.update();
    t += Renderer.deltaTime;
    i++;
});
