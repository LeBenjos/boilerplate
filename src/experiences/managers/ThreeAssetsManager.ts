import { DataTexture, EquirectangularRefractionMapping, LinearSRGBColorSpace, Texture, TextureLoader } from "three";
import { GLTFLoader, HDRLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { AssetId } from "../constants/experiences/AssetId";
import { Action } from "../tools/Action";

export default class ThreeAssetsManager {
    private static _assets: Map<string, Texture | DataTexture | GLTF> = new Map<string, Texture | GLTF>();
    private static _ToLoad: number = 0;
    private static _Loaded: number = 0;

    private static _TextureLoader = new TextureLoader();
    private static _HDRLoader = new HDRLoader();
    private static _GltfLoader = new GLTFLoader();

    public static OnFinishLoad = new Action();

    public static Init(): void {
        //
    }

    public static AddTexture(id: AssetId, asset: string): void {
        ThreeAssetsManager._ToLoad++;
        ThreeAssetsManager._TextureLoader.load(asset, (texture) => {
            texture.colorSpace = LinearSRGBColorSpace;
            ThreeAssetsManager._onLoad(id, texture);
        });
    }

    public static AddHDR(id: AssetId, asset: string): void {
        ThreeAssetsManager._ToLoad++;
        ThreeAssetsManager._HDRLoader.load(asset, (dataTexture) => {
            dataTexture.mapping = EquirectangularRefractionMapping;
            dataTexture.colorSpace = LinearSRGBColorSpace;
            ThreeAssetsManager._onLoad(id, dataTexture);
        });
    }

    public static AddModel(id: AssetId, asset: string): void {
        ThreeAssetsManager._ToLoad++;
        ThreeAssetsManager._GltfLoader.load(asset, (model) => {
            ThreeAssetsManager._onLoad(id, model);
        });
    }

    public static GetTexture(id: AssetId): Texture {
        const asset = ThreeAssetsManager._assets.get(id)! as Texture;
        if (!asset) throw new Error(`Texture with id '${id}' not found!`);
        return asset;
    }

    public static GetHDR(id: AssetId): DataTexture {
        const asset = ThreeAssetsManager._assets.get(id)! as DataTexture;
        if (!asset) throw new Error(`HDR with id '${id}' not found!`);
        return asset;
    }

    public static GetModel(id: AssetId): GLTF {
        const asset = ThreeAssetsManager._assets.get(id)! as GLTF;
        if (!asset) throw new Error(`Model with id '${id}' not found!`);
        return asset;
    }

    private static _onLoad(id: AssetId, asset: Texture | GLTF): void {
        ThreeAssetsManager._assets.set(id, asset);
        ThreeAssetsManager._Loaded++;

        if (ThreeAssetsManager._Loaded === ThreeAssetsManager._ToLoad) {
            ThreeAssetsManager._onFinishLoad();
        }
    }

    private static _onFinishLoad(): void {
        ThreeAssetsManager.OnFinishLoad.execute();
    }

    public static get IsLoaded(): boolean { return ThreeAssetsManager._Loaded === ThreeAssetsManager._ToLoad && ThreeAssetsManager._ToLoad > 0; }
}
