import Camera from "./components/Camera";
import Component from "./classes/Component";
import GameObject from "./classes/GameObject";
import Renderer from "./classes/Renderer";
import MeshRenderer from "./components/MeshRenderer";
import "./style.css";
import FileLoader from "./tools/FileLoader";
import FPSCounter from "./tools/FPSCounter";
import Importer from "./tools/Importer";
import ObjLoader from "./tools/ObjLoader";
import Quaternion from "./utilities/Quaternion";
import Vector3 from "./utilities/math/Vector3";
import Color from "./utilities/math/Color";
import Light, { LightType } from "./components/Light";
import GouraudMaterial from "./classes/Materials/GouraudMaterial";
import FlatMaterial from "./classes/Materials/FlatMaterial";
import WireframeMaterial from "./classes/Materials/WireframeMaterial";
import PongMaterial from "./classes/Materials/PongMaterial";

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

const cube = new ObjLoader(await FileLoader.load("/cube.obj")).parse();

const materialPong = new PongMaterial(Color.white, 50);
const materialGouraud = new GouraudMaterial(Color.white, 15);
const materialFlat = new FlatMaterial(Color.white, 1);
const wireframe = new WireframeMaterial(Color.red);

const data = {
    name: "scene",
    children: [
        {
            name: "o",
            transform: {
                position: [0, -2, 6],
                rotation: [0, 1, 0],
                scale: [1, 1, 1],
            },
            components: [
                new MeshRenderer(teapot, materialPong),
                //new Rotate(new Vector3(0.1, 0.1, 0.1)),
            ],
            children: [
                {
                    name: "e",
                    transform: {
                        position: [0, 2, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    components: [new Rotate(new Vector3(0, 1, 0))],
                    children: [
                        {
                            name: "light",
                            transform: {
                                position: [-5, 0, 0],
                                rotation: [1, 1, 1],
                                scale: [0.2, 0.2, 0.2],
                            },
                            components: [
                                new Light(LightType.POINT, 1, Color.blue),
                                new MeshRenderer(cube, wireframe),
                            ],
                        },
                        {
                            name: "light",
                            transform: {
                                position: [5, 0, 0],
                                rotation: [1, 1, 1],
                                scale: [0.2, 0.2, 0.2],
                            },
                            components: [
                                new Light(LightType.POINT, 1, Color.white),
                                new MeshRenderer(cube, wireframe),
                            ],
                        },
                    ],
                },
            ],
        },
        // {
        //     name: "r",
        //     transform: {
        //         position: [10, 0, 0],
        //         rotation: [1, 0, 1],
        //         scale: [1, 2, 3],
        //     },
        //     components: [new MeshRenderer(cube)],
        // },
        // {
        //     name: "l",
        //     transform: {
        //         position: [-10, 0, 0],
        //         scale: [1, 2, 3],
        //     },
        //     components: [new MeshRenderer(cube)],
        // },

        // {
        //     name: "g",
        //     transform: {
        //         position: [2, 0, 6],
        //         scale: [0.5, 0.5, 0.5],
        //     },
        //     children: [
        //         {
        //             name: "cube",
        //             transform: {
        //                 position: [1, 1, 1],
        //                 scale: [1.5, 1.5, 1.5],
        //             },
        //             components: [new MeshRenderer(teapot, material)],
        //         },
        //     ],
        //     components: [new Rotate(new Vector3(0.1, 0.1, 0.1))],
        // },
        // {
        //     name: "g",
        //     transform: {
        //         position: [-2, 0, 6],
        //         scale: [0.5, 0.5, 0.5],
        //     },
        //     children: [
        //         {
        //             name: "cube",
        //             transform: {
        //                 position: [-1, 1, 1],
        //                 scale: [1.5, 1.5, 1.5],
        //             },
        //             components: [new MeshRenderer(teapot, material2)],
        //         },
        //     ],
        //     components: [new Rotate(new Vector3(0.1, 0.1, 0.1))],
        // },
    ],
};

const scene = Importer.scene(data);

const canvas = document.getElementById("root") as HTMLCanvasElement;

const cam = new GameObject("cam");
//cam.addComponent(new Rotate(new Vector3(0, 0.1, 0)));
cam.transform.rotation = Quaternion.euler(new Vector3(0, 0, 0));
scene.addChildren(cam);

const r = new Renderer(canvas);
r.setCamera(cam.addComponent(new Camera(90, 1, r.canvasRatio)) as Camera);
r.setScene(scene);

const fps = new FPSCounter(document.getElementById("fps") as HTMLElement);
// r.render();

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
