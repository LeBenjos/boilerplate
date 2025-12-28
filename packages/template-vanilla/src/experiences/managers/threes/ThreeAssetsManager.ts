import { Action, AssetUtils } from '@benjos/cookware';
import {
    DataTexture,
    EquirectangularRefractionMapping,
    LinearSRGBColorSpace,
    RepeatWrapping,
    Texture,
    TextureLoader,
    type ColorSpace,
    type Mapping,
    type Wrapping,
} from 'three';
import { DRACOLoader, Font, FontLoader, GLTFLoader, HDRLoader, type GLTF } from 'three/examples/jsm/Addons.js';
import type { AssetId } from '../../constants/experiences/AssetId';
import { AssetType } from '../../constants/experiences/AssetType';
import LoaderManager from '../LoaderManager';

export interface IThreeAssetToLoad {
    id: AssetId;
    type: AssetType;
    path: string;
    option?: IThreeAssetOption;
    loadedSize: number;
    totalSize: number;
}

export interface IThreeAssetOption { }

export interface IThreeTextureOption extends IThreeAssetOption {
    colorSpace?: ColorSpace;
    wrapping?: Wrapping;
    repeatX?: number;
    repeatY?: number;
    centerX?: number;
    centerY?: number;
}

export interface IThreeHDROption extends IThreeAssetOption {
    mapping?: Mapping;
    colorSpace?: ColorSpace;
}

export interface IThreeModelOption extends IThreeAssetOption { }

export interface IThreeFontOption extends IThreeAssetOption { }

export default class ThreeAssetsManager {
    private static readonly _Assets: Map<string, Texture | DataTexture | GLTF | Font> = new Map<
        string,
        Texture | GLTF | Font
    >();
    private static readonly _ToLoadList: IThreeAssetToLoad[] = [];
    private static _ExpectedAssetsCount = 0;

    private static readonly _TextureLoader = new TextureLoader();
    private static readonly _HDRLoader = new HDRLoader();
    private static readonly _GltfLoader = new GLTFLoader();
    private static readonly _DracoLoader = new DRACOLoader();
    private static readonly _FontLoader = new FontLoader();

    public static readonly OnLoad = new Action();
    public static readonly OnProgress = new Action();

    //#region Constants
    //
    private static readonly _DRACO_LOADER_PATH: string = 'loaders/draco/';
    private static readonly _DEFAULT_TEXTURE_OPTION_COLOR_SPACE: ColorSpace = LinearSRGBColorSpace;
    private static readonly _DEFAULT_TEXTURE_OPTION_WRAPPING: Wrapping = RepeatWrapping;
    private static readonly _DEFAULT_TEXTURE_OPTION_REPEAT_X: number = 1;
    private static readonly _DEFAULT_TEXTURE_OPTION_REPEAT_Y: number = 1;
    private static readonly _DEFAULT_TEXTURE_OPTION_CENTER_X: number = 0.5;
    private static readonly _DEFAULT_TEXTURE_OPTION_CENTER_Y: number = 0.5;
    private static readonly _DEFAULT_HDR_MAPPING: Mapping = EquirectangularRefractionMapping;
    private static readonly _DEFAULT_HDR_COLOR_SPACE: ColorSpace = LinearSRGBColorSpace;
    private static readonly _DEFAULT_LOADED_SIZE: number = 0;
    private static readonly _DEFAULT_TOTAL_SIZE: number = -1;
    private static readonly _DEFAULT_TEXTURE_TOTAL_SIZE: number = 1;
    //
    //#endregion

    public static Init(): void {
        ThreeAssetsManager._DracoLoader.setDecoderPath(AssetUtils.getPath(ThreeAssetsManager._DRACO_LOADER_PATH));
        ThreeAssetsManager._GltfLoader.setDRACOLoader(ThreeAssetsManager._DracoLoader);
        ThreeAssetsManager._AddCallbacks();
    }

    private static _AddCallbacks(): void {
        ThreeAssetsManager._RemoveCallbacks();
        LoaderManager.OnBeginLoad.add(ThreeAssetsManager._OnBeginLoad);
        LoaderManager.OnFinishLoad.add(ThreeAssetsManager._OnFinishLoad);
    }

    private static _RemoveCallbacks(): void {
        LoaderManager.OnBeginLoad.remove(ThreeAssetsManager._OnBeginLoad);
        LoaderManager.OnFinishLoad.remove(ThreeAssetsManager._OnFinishLoad);
    }

    public static AddTexture(id: AssetId, path: string, textureOption?: IThreeTextureOption): void {
        ThreeAssetsManager._ToLoadList.push({
            id,
            type: AssetType.TEXTURE,
            path,
            option: textureOption,
            loadedSize: ThreeAssetsManager._DEFAULT_LOADED_SIZE,
            totalSize: ThreeAssetsManager._DEFAULT_TEXTURE_TOTAL_SIZE,
        });
        ThreeAssetsManager._ExpectedAssetsCount++;
    }

    public static AddHDR(id: AssetId, path: string, hdrOption?: IThreeHDROption): void {
        ThreeAssetsManager._ToLoadList.push({
            id,
            type: AssetType.HDR,
            path,
            option: hdrOption,
            loadedSize: ThreeAssetsManager._DEFAULT_LOADED_SIZE,
            totalSize: ThreeAssetsManager._DEFAULT_TOTAL_SIZE,
        });
        ThreeAssetsManager._ExpectedAssetsCount++;
    }

    public static AddModel(id: AssetId, path: string, modelOption?: IThreeModelOption): void {
        ThreeAssetsManager._ToLoadList.push({
            id,
            type: AssetType.MODEL,
            path,
            option: modelOption,
            loadedSize: ThreeAssetsManager._DEFAULT_LOADED_SIZE,
            totalSize: ThreeAssetsManager._DEFAULT_TOTAL_SIZE,
        });
        ThreeAssetsManager._ExpectedAssetsCount++;
    }

    public static AddFont(id: AssetId, path: string, fontOption?: IThreeFontOption): void {
        ThreeAssetsManager._ToLoadList.push({
            id,
            type: AssetType.FONT,
            path,
            option: fontOption,
            loadedSize: ThreeAssetsManager._DEFAULT_LOADED_SIZE,
            totalSize: ThreeAssetsManager._DEFAULT_TOTAL_SIZE,
        });
        ThreeAssetsManager._ExpectedAssetsCount++;
    }

    private static _OnBeginLoad = (): void => {
        if (ThreeAssetsManager._ToLoadList.length === 0) {
            ThreeAssetsManager.OnLoad.execute();
            return;
        }
        for (const asset of ThreeAssetsManager._ToLoadList) {
            if (asset.type === AssetType.TEXTURE) ThreeAssetsManager._LoadTexture(asset);
            else if (asset.type === AssetType.HDR) ThreeAssetsManager._LoadHDR(asset);
            else if (asset.type === AssetType.MODEL) ThreeAssetsManager._LoadModel(asset);
            else if (asset.type === AssetType.FONT) ThreeAssetsManager._LoadFont(asset);
        }
    };

    private static readonly _OnFinishLoad = (): void => {
        ThreeAssetsManager._ToLoadList.length = 0;
    };

    private static _LoadTexture(asset: IThreeAssetToLoad): void {
        const option = asset.option as IThreeTextureOption | undefined;
        ThreeAssetsManager._TextureLoader.load(
            asset.path,
            (texture) => {
                texture.colorSpace = option?.colorSpace ?? ThreeAssetsManager._DEFAULT_TEXTURE_OPTION_COLOR_SPACE;
                texture.wrapS = texture.wrapT = option?.wrapping ?? ThreeAssetsManager._DEFAULT_TEXTURE_OPTION_WRAPPING;
                texture.repeat.set(
                    option?.repeatX ?? ThreeAssetsManager._DEFAULT_TEXTURE_OPTION_REPEAT_X,
                    option?.repeatY ?? ThreeAssetsManager._DEFAULT_TEXTURE_OPTION_REPEAT_Y
                );
                texture.center.set(
                    option?.centerX ?? ThreeAssetsManager._DEFAULT_TEXTURE_OPTION_CENTER_X,
                    option?.centerY ?? ThreeAssetsManager._DEFAULT_TEXTURE_OPTION_CENTER_Y
                );
                asset.loadedSize = asset.totalSize;
                ThreeAssetsManager._OnLoad(asset.id, texture);
            },
            (event: ProgressEvent) => ThreeAssetsManager._OnProgress(asset, event),
            () => ThreeAssetsManager._OnError(AssetType.TEXTURE, asset.id, asset.path)
        );
    }

    private static _LoadHDR(asset: IThreeAssetToLoad): void {
        const option = asset.option as IThreeHDROption | undefined;
        ThreeAssetsManager._HDRLoader.load(
            asset.path,
            (dataTexture) => {
                dataTexture.mapping = option?.mapping ?? ThreeAssetsManager._DEFAULT_HDR_MAPPING;
                dataTexture.colorSpace = option?.colorSpace ?? ThreeAssetsManager._DEFAULT_HDR_COLOR_SPACE;
                ThreeAssetsManager._OnLoad(asset.id, dataTexture);
            },
            (event: ProgressEvent) => ThreeAssetsManager._OnProgress(asset, event),
            () => ThreeAssetsManager._OnError(AssetType.HDR, asset.id, asset.path)
        );
    }

    private static _LoadModel(asset: IThreeAssetToLoad): void {
        ThreeAssetsManager._GltfLoader.load(
            asset.path,
            (model) => ThreeAssetsManager._OnLoad(asset.id, model),
            (event: ProgressEvent) => ThreeAssetsManager._OnProgress(asset, event),
            () => ThreeAssetsManager._OnError(AssetType.MODEL, asset.id, asset.path)
        );
    }

    private static _LoadFont(asset: IThreeAssetToLoad): void {
        ThreeAssetsManager._FontLoader.load(
            asset.path,
            (font) => ThreeAssetsManager._OnLoad(asset.id, font),
            (event: ProgressEvent) => ThreeAssetsManager._OnProgress(asset, event),
            () => ThreeAssetsManager._OnError(AssetType.FONT, asset.id, asset.path)
        );
    }

    private static _OnLoad(id: AssetId, asset: Texture | GLTF | Font): void {
        ThreeAssetsManager._Assets.set(id, asset);
        ThreeAssetsManager.OnLoad.execute();
    }

    private static _OnProgress(asset: IThreeAssetToLoad, event: ProgressEvent): void {
        if (asset.totalSize === ThreeAssetsManager._DEFAULT_TOTAL_SIZE) asset.totalSize = event.total;
        asset.loadedSize = event.loaded;
        ThreeAssetsManager.OnProgress.execute();
    }

    private static _OnError(type: AssetType, id: AssetId, path: string): void {
        throw new Error(`ThreeAssetsManager: Failed to load ${type} with id '${id}' from path '${path}'`);
    }

    public static GetTexture(id: AssetId): Texture {
        const asset = ThreeAssetsManager._Assets.get(id);
        if (!asset) throw new Error(`Texture with id '${id}' not found!`);
        return asset as Texture;
    }

    public static GetHDR(id: AssetId): DataTexture {
        const asset = ThreeAssetsManager._Assets.get(id);
        if (!asset) throw new Error(`HDR with id '${id}' not found!`);
        return asset as DataTexture;
    }

    public static GetModel(id: AssetId): GLTF {
        const asset = ThreeAssetsManager._Assets.get(id);
        if (!asset) throw new Error(`Model with id '${id}' not found!`);
        return asset as GLTF;
    }

    public static GetFont(id: AssetId): Font {
        const asset = ThreeAssetsManager._Assets.get(id);
        if (!asset) throw new Error(`Font with id '${id}' not found!`);
        return asset as Font;
    }

    //#region Getters
    //
    public static get IsLoaded(): boolean {
        return ThreeAssetsManager._Assets.size === ThreeAssetsManager._ExpectedAssetsCount;
    }
    public static get TotalSize(): number {
        let totalSize = 0;
        for (const asset of ThreeAssetsManager._ToLoadList) {
            totalSize += asset.totalSize;
        }
        return totalSize;
    }
    public static get LoadedSize(): number {
        let loadedSize = 0;
        for (const asset of ThreeAssetsManager._ToLoadList) {
            loadedSize += asset.loadedSize;
        }
        return loadedSize;
    }
    //
    //#endregion
}
