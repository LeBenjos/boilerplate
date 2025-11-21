import { DataTexture, EquirectangularRefractionMapping, LinearSRGBColorSpace, RepeatWrapping, Texture, TextureLoader, type ColorSpace, type Mapping, type Wrapping } from "three";
import { DRACOLoader, Font, FontLoader, GLTFLoader, HDRLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { AssetId } from "../constants/experiences/AssetId";
import { AssetType } from "../constants/experiences/AssetType";
import { Action } from "../tools/Action";
import AssetUtils from "../Utils/AssetUtils";

export interface IAssetToLoad {
    id: AssetId,
    type: AssetType,
    path: string,
    option?: IAssetOption
}

export interface IAssetOption {
    //
}

export interface ITextureOption extends IAssetOption {
    colorSpace?: ColorSpace;
    wrapping?: Wrapping;
    repeatX?: number;
    repeatY?: number;
    centerX?: number;
    centerY?: number;
}

export interface IHDROption extends IAssetOption {
    mapping?: Mapping;
    colorSpace?: ColorSpace;
}

export interface IModelOption extends IAssetOption {
    //
}

export interface IFontOption extends IAssetOption {
    //
}

export default class ThreeAssetsManager {
    private static _assets: Map<string, Texture | DataTexture | GLTF | Font> = new Map<string, Texture | GLTF | Font>();
    private static _ToLoadList: IAssetToLoad[] = [];
    private static _LoadedCount: number = 0;

    private static _TextureLoader = new TextureLoader();
    private static _HDRLoader = new HDRLoader();
    private static _GltfLoader = new GLTFLoader();
    private static _DracoLoader = new DRACOLoader();
    private static _FontLoader = new FontLoader();

    public static OnLoad = new Action();

    public static Init(): void {
        ThreeAssetsManager._DracoLoader.setDecoderPath(AssetUtils.GetPath("loaders/draco/"));
        ThreeAssetsManager._GltfLoader.setDRACOLoader(ThreeAssetsManager._DracoLoader);
    }

    public static AddTexture(id: AssetId, path: string, textureOption?: ITextureOption) {
        ThreeAssetsManager._ToLoadList.push({ id, type: AssetType.TEXTURE, path, option: textureOption });
    }

    public static AddHDR(id: AssetId, path: string, hdrOption?: IHDROption) {
        ThreeAssetsManager._ToLoadList.push({ id, type: AssetType.HDR, path, option: hdrOption });
    }

    public static AddModel(id: AssetId, path: string, modelOption?: IModelOption) {
        ThreeAssetsManager._ToLoadList.push({ id, type: AssetType.MODEL, path, option: modelOption });
    }

    public static AddFont(id: AssetId, path: string, fontOption?: IFontOption) {
        ThreeAssetsManager._ToLoadList.push({ id, type: AssetType.FONT, path, option: fontOption });
    }

    public static LoadAssets(): void {
        for (const asset of ThreeAssetsManager._ToLoadList) {
            if (asset.type === AssetType.TEXTURE) ThreeAssetsManager._LoadTexture(asset);
            else if (asset.type === AssetType.HDR) ThreeAssetsManager._LoadHDR(asset);
            else if (asset.type === AssetType.MODEL) ThreeAssetsManager._LoadModel(asset);
            else if (asset.type === AssetType.FONT) ThreeAssetsManager._LoadFont(asset);
        }
    }

    private static _LoadTexture(asset: IAssetToLoad): void {
        const option = asset.option as ITextureOption | undefined;

        ThreeAssetsManager._TextureLoader.load(
            asset.path,
            (texture) => {
                texture.colorSpace = option?.colorSpace || LinearSRGBColorSpace;
                texture.wrapS = texture.wrapT = option?.wrapping || RepeatWrapping;
                texture.repeat.set(option?.repeatX || 1, option?.repeatY || 1);
                texture.center.set(option?.centerX || 0.5, option?.centerY || 0.5);
                ThreeAssetsManager._onLoad(asset.id, texture);
            },
            undefined,
            () => ThreeAssetsManager._LoadFailed(AssetType.TEXTURE, asset.id, asset.path),
        );
    }

    private static _LoadHDR(asset: IAssetToLoad): void {
        const option = asset.option as IHDROption | undefined;
        ThreeAssetsManager._HDRLoader.load(
            asset.path,
            (dataTexture) => {
                dataTexture.mapping = option?.mapping || EquirectangularRefractionMapping;
                dataTexture.colorSpace = option?.colorSpace || LinearSRGBColorSpace;
                ThreeAssetsManager._onLoad(asset.id, dataTexture);
            },
            undefined,
            () => ThreeAssetsManager._LoadFailed(AssetType.HDR, asset.id, asset.path),
        );
    }

    private static _LoadModel(asset: IAssetToLoad): void {
        ThreeAssetsManager._GltfLoader.load(
            asset.path,
            (model) => ThreeAssetsManager._onLoad(asset.id, model),
            undefined,
            () => ThreeAssetsManager._LoadFailed(AssetType.MODEL, asset.id, asset.path),
        );
    }

    private static _LoadFont(asset: IAssetToLoad): void {
        ThreeAssetsManager._FontLoader.load(
            asset.path,
            (font) => ThreeAssetsManager._onLoad(asset.id, font),
            undefined,
            () => ThreeAssetsManager._LoadFailed(AssetType.FONT, asset.id, asset.path),
        );
    }

    private static _LoadFailed(type: AssetType, id: AssetId, path: string): void {
        console.error(`ThreeAssetsManager: Failed to load ${type} with id '${id}' from path '${path}'`);
    }

    private static _onLoad(id: AssetId, asset: Texture | GLTF | Font): void {
        ThreeAssetsManager._assets.set(id, asset);
        ThreeAssetsManager._LoadedCount++;
        ThreeAssetsManager.OnLoad.execute();
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
    public static get IsLoaded(): boolean { return ThreeAssetsManager._LoadedCount === ThreeAssetsManager._ToLoadList.length && ThreeAssetsManager._ToLoadList.length > 0; }
    public static get ToLoadCount(): number { return ThreeAssetsManager._ToLoadList.length; }
    //
    //#endregion
}
