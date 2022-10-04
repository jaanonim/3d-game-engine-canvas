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
import TextureLoader from "./tools/TextureLoader";
import CameraOrthographic from "./components/CameraOrthographic";
import SpriteRenderer from "./components/SpriteRenderer";

class Rotate extends Component {
    v: number;
    rotation: Vector3;

    constructor(rotation: Vector3) {
        super();
        this.v = 0;
        this.rotation = rotation;
    }

    async update() {
        this.gameObject.transform.rotation = Quaternion.euler(
            this.rotation.multiply(this.v)
        );
        this.v += 0.1;
    }
}

const teapot = new ObjLoader(await FileLoader.load("/torus.obj")).parse();
async function main() {
    const cube = new ObjLoader(await FileLoader.load("/cube.obj")).parse();

    const testTexture = new TextureLoader(
        await FileLoader.loadImg("/test2.png")
    ).parse();
    //testTexture.bilinearFiltering = false;

    const materialPong = new PongMaterial(Color.white, 50, testTexture);
    const materialGouraud = new GouraudMaterial(Color.white, 15, testTexture);
    const materialFlat = new FlatMaterial(Color.white, 1);
    const wireframe = new WireframeMaterial(Color.red);

    const uiData = {
        name: "scene",
        children: [
            {
                name: "o",
                transform: {
                    position: [-1, 0, 1],
                    rotation: [0, 0, 0],
                    scale: [1, 1, 1],
                },
                components: [
                    new SpriteRenderer(testTexture, new Color(0, 255, 0, 100)),
                ],
            },
            {
                name: "o",
                transform: {
                    position: [0, 1, 1],
                    rotation: [0, 0, 0],
                    scale: [1, 1, 1],
                },
                components: [
                    new SpriteRenderer(testTexture, new Color(255, 0, 0, 100)),
                ],
            },
        ],
    };

    const data = {
        name: "scene",
        children: [
            {
                name: "o",
                transform: {
                    position: [-1, 0, 2],
                    rotation: [-Math.PI / 2, Math.PI, 0],
                    scale: [0.3, 0.3, 0.3],
                },
                components: [
                    new MeshRenderer(teapot, materialPong),
                    new Rotate(new Vector3(0.1, 0.1, 0.1)),
                ],
            },
            {
                name: "light",
                transform: {
                    position: [0, 0, 1],
                    rotation: [1, 1, 1],
                    scale: [0.2, 0.2, 0.2],
                },
                components: [
                    new Light(LightType.POINT, 0.7, Color.white),
                    new MeshRenderer(cube, wireframe),
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
    const ui = Importer.scene(uiData);

    const canvas = document.getElementById("root") as HTMLCanvasElement;

    const cam = new GameObject("cam");
    cam.transform.rotation = Quaternion.euler(new Vector3(0, 0, 0));
    scene.addChildren(cam);

    const cam2 = new GameObject("cam2");
    cam2.transform.rotation = Quaternion.euler(new Vector3(0, 0, 0));
    ui.addChildren(cam2);

    const r = new Renderer(canvas);
    r.setCamera(
        cam.addComponent(new Camera(r.canvasRatio, 90, 1, 100)) as Camera,
        0
    );
    r.setCamera(
        cam2.addComponent(
            new CameraOrthographic(r.canvasRatio, 10, 1, 100)
        ) as Camera,
        1
    );

    const fps = new FPSCounter(document.getElementById("fps") as HTMLElement);
    // scene.start();
    // r.render();

    await r.startGameLoop(() => {
        fps.update();
    });
}
main();
