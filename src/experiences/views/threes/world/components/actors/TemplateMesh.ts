import { Mesh, MeshStandardMaterial, RepeatWrapping, SphereGeometry } from "three";
import { AssetId } from "../../../../../constants/experiences/AssetId";
import ThreeAssetsManager from "../../../../../managers/ThreeAssetsManager";
import ActorBase from "./bases/ActorBase";

export default class TemplateMesh extends ActorBase {
    private _geometry: SphereGeometry;
    private _material: MeshStandardMaterial;
    private _mesh: Mesh;

    constructor() {
        super();
        this._geometry = new SphereGeometry(1, 64, 64);

        const normalMat = ThreeAssetsManager.GetTexture(AssetId.TEXTURE_TEMPLATE);
        normalMat.repeat.set(1.5, 1.5);
        normalMat.wrapS = normalMat.wrapT = RepeatWrapping;

        this._material = new MeshStandardMaterial({
            color: 0xffffff,
            normalMap: normalMat,
            metalness: 0.7,
            roughness: 0.2,
            envMapIntensity: 0,
        });

        this._mesh = new Mesh(this._geometry, this._material);
        this._mesh.castShadow = true;
        this._mesh.receiveShadow = true;
        this.add(this._mesh);
    }

    public update(dt: number): void {
        super.update(dt);
        this._mesh.rotation.y += dt * 0.25;
    }
}