import Camera from "./components/Camera";
import Component from "./classes/Components/Component";
import GameObject from "./classes/GameObject";
import Renderer from "./classes/Renderer";
import MeshRenderer from "./components/MeshRenderer";
import "./style.css";
import FileLoader from "./tools/FileLoader";
import FPSCounter from "./tools/FPSCounter";
import Importer from "./tools/Importer";
import ObjLoader from "./tools/ObjLoader";
import Quaternion from "./utilities/math/Quaternion";
import Vector3 from "./utilities/math/Vector3";
import Color from "./utilities/math/Color";
// import Light, { LightType } from "./components/Light";
//import PongMaterial from "./classes/Materials/PongMaterial";
// import TextureLoader from "./tools/TextureLoader";
// import UiScreen from "./components/UiScreen";
// import UiElement from "./components/UiElement";
// import Vector2 from "./utilities/math/Vector2";
// import Image from "./components/Image";
// import Text from "./components/Text";
import WireframeMaterial from "./classes/Materials/WireframeMaterial";
// import { PositionType, SizeType } from "./classes/Components/SizedComponent";
import SphereCollider from "./components/colliders/SphereCollider";
import BoxCollider from "./components/colliders/BoxCollider";

class Rotate extends Component {
    v: number;
    rotation: Vector3;
    collider: SphereCollider | undefined;

    constructor(rotation: Vector3) {
        super();
        this.v = 0;
        this.rotation = rotation;
    }

    async start(): Promise<void> {
        this.collider =
            this.gameObject.getComponent<SphereCollider>(SphereCollider);
    }

    async update() {
        this.gameObject.transform.rotation = Quaternion.euler(
            this.rotation.multiply(this.v)
        );
        this.v += 0.1;
        this.log(this.collider?.getCollisions());
    }
}

async function main() {
    const cube = new ObjLoader(await FileLoader.load("/cube.obj")).parse();
    const teapot = new ObjLoader(await FileLoader.load("/torus.obj")).parse(
        true
    );
    teapot.doubleSided = true;

    const canvas = document.getElementById("root") as HTMLCanvasElement;
    const r = new Renderer(canvas, 0.6, 2, false);
    // const testTexture = new TextureLoader(
    //     await FileLoader.loadImg("/test.png")
    // ).parse();
    // const testTexture2 = new TextureLoader(
    //     await FileLoader.loadImg("/test2.png")
    // ).parse();
    //testTexture.bilinearFiltering = false;

    //const materialPong = new PongMaterial(Color.white, 50, testTexture);
    // const materialGouraud = new GouraudMaterial(Color.white, 15, testTexture);
    // const materialFlat = new FlatMaterial(Color.white, 1);
    const wireframe = new WireframeMaterial(Color.red);

    const data = {
        name: "scene",
        children: [
            {
                name: "o",
                transform: {
                    position: [0, 0, 2],
                    rotation: [-Math.PI / 2, Math.PI, 0],
                    scale: [0.3, 0.3, 0.3],
                },
                components: [
                    new MeshRenderer(cube, wireframe),
                    new Rotate(new Vector3(0.1, 0.1, 0.1)),
                    new BoxCollider(),
                ],
            },
            {
                name: "o",
                transform: {
                    position: [0.6, 0, 2],
                    rotation: [-Math.PI / 2, Math.PI, 0],
                    scale: [0.3, 0.3, 0.3],
                },
                components: [
                    new MeshRenderer(cube, wireframe),
                    new Rotate(new Vector3(0.1, 0.1, 0.1)),
                    new SphereCollider(),
                ],
            },
            // {
            //     name: "light",
            //     transform: {
            //         position: [0, 0, 1],
            //         rotation: [1, 1, 1],
            //         scale: [0.2, 0.2, 0.2],
            //     },
            //     components: [
            //         new Light(LightType.POINT, 0.7, Color.white),
            //         // new MeshRenderer(cube, wireframe),
            //     ],
            // },
            // {
            //     name: "screen",
            //     components: [new UiScreen(r, 1)],
            //     children: [
            //         // {
            //         //     name: "img",
            //         //     components: [
            //         //         new UiElement(new Vector2(100, 100)),
            //         //         new Image(testTexture),
            //         //     ],
            //         // },
            //         {
            //             name: "t",
            //             components: [
            //                 new UiElement(
            //                     new Vector2(50, 50),
            //                     undefined,
            //                     SizeType.PERCENTAGE,
            //                     PositionType.CENTER_CENTER
            //                 ),
            //                 new Image(testTexture),
            //             ],
            //             children: [
            //                 {
            //                     name: "text",
            //                     transform: {
            //                         position: [0, 0, 0],
            //                     },
            //                     components: [
            //                         new UiElement(
            //                             new Vector2(50, 50),
            //                             1,
            //                             SizeType.PERCENTAGE,
            //                             PositionType.CENTER_CENTER
            //                         ),
            //                         new Image(testTexture2),
            //                         new Text("Lorem ipsum", {
            //                             fontSize: 40,
            //                             color: Color.blue,
            //                         }),
            //                     ],
            //                 },
            //             ],
            //         },
            //     ],
            // },
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
    const cam = new GameObject("cam");
    cam.transform.rotation = Quaternion.euler(new Vector3(0, 0, 0));
    scene.addChildren(cam);
    r.setCamera(cam.addComponent(new Camera(r, 90, 1, 100)) as Camera, 0);

    const fps = new FPSCounter(document.getElementById("fps") as HTMLElement);
    // scene.start();
    // r.render();
    await r.startGameLoop(() => {
        fps.update();
    });
}
main();
