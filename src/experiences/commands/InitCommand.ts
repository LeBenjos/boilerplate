import { AssetId } from "../constants/experiences/AssetId";
import Experience from "../Experience";
import CameraControllerManager from "../managers/CameraControllerManager";
import CursorManager from "../managers/CursorManager";
import DebugManager from "../managers/DebugManager";
import { KeyboardManager } from "../managers/KeyboardManager";
import { ResizeManager } from "../managers/ResizeManager";
import ThreeAssetsManager from "../managers/ThreeAssetsManager";
import TickerManager from "../managers/TickerManager";
import AssetUtils from "../Utils/AssetUtils";

export default class InitCommand {
    public static async begin(): Promise<void> {
        this._initProxies();
        this._initCommon();
        this._initThree();
        this._initManagers();
        this._initUtils();

        Experience.Init();
    }

    private static async _initProxies(): Promise<void> {
        // 
    }

    private static async _initUtils(): Promise<void> {
        //
    }

    private static async _initManagers(): Promise<void> {
        TickerManager.Init();
        DebugManager.Init();
        KeyboardManager.Init();
        CursorManager.Init();
        ResizeManager.Init();
        ThreeAssetsManager.Init();
        CameraControllerManager.Init();
        ThreeAssetsManager.OnFinishLoad.add(InitCommand._initAfterLoad);
    }

    private static async _initCommon(): Promise<void> {
        // 
    }

    private static async _initThree(): Promise<void> {
        ThreeAssetsManager.AddHDR(AssetId.HDR_TEMPLATE, AssetUtils.GetPath("hdrs/template.hdr"));
        ThreeAssetsManager.AddModel(AssetId.MODEL_TEMPLATE, AssetUtils.GetPath("models/template.glb"));
        ThreeAssetsManager.AddTexture(AssetId.TEXTURE_TEMPLATE, AssetUtils.GetPath("textures/template.jpg"));

        ThreeAssetsManager.LoadAssets();
    }

    private static _initAfterLoad = (): void => {
        //
    }

    private static async _end(): Promise<void> {
        // 
    }
}
