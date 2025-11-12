import { DataTexture, EquirectangularRefractionMapping, LinearSRGBColorSpace, RepeatWrapping, SRGBColorSpace, Texture, TextureLoader } from "three";
import { DRACOLoader, Font, FontLoader, GLTFLoader, HDRLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { AssetId } from "../constants/experiences/AssetId";
import { AssetType } from "../constants/experiences/AssetType";
import { Action } from "../tools/Action";
import AssetUtils from "../Utils/AssetUtils";

export default class ThreeAssetsManager {
    private static _assets: Map<string, Texture | DataTexture | GLTF | Font> = new Map<string, Texture | GLTF | Font>();
    private static _ToLoadList: { id: AssetId; type: AssetType; path: string }[] = [];
    private static _Loaded: number = 0;

    private static _TextureLoader = new TextureLoader();
    private static _HDRLoader = new HDRLoader();
    private static _GltfLoader = new GLTFLoader();
    private static _DracoLoader = new DRACOLoader();
    private static _FontLoader = new FontLoader();

    public static OnFinishLoad = new Action();

    public static Init(): void {
        ThreeAssetsManager._DracoLoader.setDecoderPath(AssetUtils.GetPath("loaders/draco/"));
        ThreeAssetsManager._GltfLoader.setDRACOLoader(ThreeAssetsManager._DracoLoader);
    }

    public static AddTexture(id: AssetId, path: string) {
        ThreeAssetsManager._ToLoadList.push({ id, type: AssetType.TEXTURE, path });
    }

    public static AddHDR(id: AssetId, path: string) {
        ThreeAssetsManager._ToLoadList.push({ id, type: AssetType.HDR, path });
    }

    public static AddModel(id: AssetId, path: string) {
        ThreeAssetsManager._ToLoadList.push({ id, type: AssetType.MODEL, path });
    }

    public static AddFont(id: AssetId, path: string) {
        ThreeAssetsManager._ToLoadList.push({ id, type: AssetType.FONT, path });
    }

    public static LoadAssets(): void {
        for (const asset of ThreeAssetsManager._ToLoadList) {
            if (asset.type === AssetType.TEXTURE) ThreeAssetsManager._LoadTexture(asset.id, asset.path);
            else if (asset.type === AssetType.HDR) ThreeAssetsManager._LoadHDR(asset.id, asset.path);
            else if (asset.type === AssetType.MODEL) ThreeAssetsManager._LoadModel(asset.id, asset.path);
            else if (asset.type === AssetType.FONT) ThreeAssetsManager._LoadFont(asset.id, asset.path);
        }
    }

    private static _LoadTexture(id: AssetId, path: string): void {
        ThreeAssetsManager._TextureLoader.load(
            path,
            (texture) => {
                texture.colorSpace = SRGBColorSpace;
                texture.wrapS = texture.wrapT = RepeatWrapping;
                texture.repeat.set(1, 1);
                texture.center.set(0.5, 0.5);
                ThreeAssetsManager._onLoad(id, texture);
            },
            undefined,
            () => ThreeAssetsManager._LoadFailed(AssetType.TEXTURE, id, path),
        );
    }

    private static _LoadHDR(id: AssetId, path: string): void {
        ThreeAssetsManager._HDRLoader.load(
            path,
            (dataTexture) => {
                dataTexture.mapping = EquirectangularRefractionMapping;
                dataTexture.colorSpace = LinearSRGBColorSpace;
                ThreeAssetsManager._onLoad(id, dataTexture);
            },
            undefined,
            () => ThreeAssetsManager._LoadFailed(AssetType.HDR, id, path),
        );
    }

    private static _LoadModel(id: AssetId, path: string): void {
        ThreeAssetsManager._GltfLoader.load(
            path,
            (model) => ThreeAssetsManager._onLoad(id, model),
            undefined,
            () => ThreeAssetsManager._LoadFailed(AssetType.MODEL, id, path),
        );
    }

    private static _LoadFont(id: AssetId, path: string): void {
        ThreeAssetsManager._FontLoader.load(
            path,
            (font) => ThreeAssetsManager._onLoad(id, font),
            undefined,
            () => ThreeAssetsManager._LoadFailed(AssetType.FONT, id, path),
        );
    }

    private static _LoadFailed(type: AssetType, id: AssetId, path: string): void {
        console.error(`ThreeAssetsManager: Failed to load ${type} with id '${id}' from path '${path}'`);
    }

    private static _onLoad(id: AssetId, asset: Texture | GLTF | Font): void {
        ThreeAssetsManager._assets.set(id, asset);
        ThreeAssetsManager._Loaded++;

        if (ThreeAssetsManager._Loaded === ThreeAssetsManager._ToLoadList.length) {
            ThreeAssetsManager._onFinishLoad();
        }
    }

    private static _onFinishLoad(): void {
        ThreeAssetsManager.OnFinishLoad.execute();
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

    public static GetFont(id: AssetId): Font {
        const asset = ThreeAssetsManager._assets.get(id)! as Font;
        if (!asset) throw new Error(`Font with id '${id}' not found!`);
        return asset;
    }

    //#region Getters
    //
    public static get IsLoaded(): boolean { return ThreeAssetsManager._Loaded === ThreeAssetsManager._ToLoadList.length && ThreeAssetsManager._ToLoadList.length > 0; }
    //
    //#endregion
}
