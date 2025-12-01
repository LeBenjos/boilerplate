import { Mesh, MeshStandardMaterial } from "three";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { AssetId } from "../../../../../constants/experiences/AssetId";
import ThreeAssetsManager from "../../../../../managers/threes/ThreeAssetsManager";
import ActorBase from "./bases/ActorBase";

export default class TemplateFont extends ActorBase {
    private _geometry: TextGeometry;
    private _material: MeshStandardMaterial;
    private _mesh: Mesh;

    constructor() {
        super();
        this._geometry = new TextGeometry(
            "Hello boilerplate!",
            {
                font: ThreeAssetsManager.GetFont(AssetId.THREE_FONT_TEMPLATE),
                size: 0.25,
                depth: 0.01,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4,
            }
        );
        this._geometry.center();

        this._material = new MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.7,
            roughness: 0.2,
            envMapIntensity: 0,
        });

        this._mesh = new Mesh(this._geometry, this._material);
        this._mesh.position.y = 3;

        this.add(this._mesh);
    }
}