import { AssetId } from "../constants/experiences/AssetId";
import CameraControllerManager from "../managers/CameraControllerManager";
import CursorManager from "../managers/CursorManager";
import DebugManager from "../managers/DebugManager";
import { KeyboardManager } from "../managers/KeyboardManager";
import { ResizeManager } from "../managers/ResizeManager";
import ThreeAssetsManager from "../managers/ThreeAssetsManager";
import Ticker from "../tools/Ticker";
import AssetUtils from "../Utils/AssetUtils";

export default class InitCommand {

    public static async begin(): Promise<void> {
        this._initProxies();
        this._initCommon();
        this._initThree();
        this._initManagers();
        this._initUtils();
    }

    private static async _initProxies(): Promise<void> {
        // 
    }

    private static async _initUtils(): Promise<void> {
        Ticker.Init();
    }

    private static async _initManagers(): Promise<void> {
        DebugManager.Init();
        KeyboardManager.Init();
        CursorManager.Init();
        ResizeManager.Init();
        ThreeAssetsManager.Init();
        CameraControllerManager.Init();
        ThreeAssetsManager.OnFinishLoad.add(InitCommand._initAfterLoad)
    }

    private static async _initCommon(): Promise<void> {
        // 
    }

    private static async _initThree(): Promise<void> {
        ThreeAssetsManager.AddTexture(AssetId.TEMPLATE_TEXTURE, AssetUtils.GetPath("textures/template.jpg"));
        ThreeAssetsManager.AddHDR(AssetId.TEMPLATE_HDR, AssetUtils.GetPath("hdrs/template.hdr"));
        ThreeAssetsManager.AddModel(AssetId.TEMPLATE_MODEL, AssetUtils.GetPath("models/template.glb"));
    }

    private static _initAfterLoad = (): void => {
        //
    }

    private static async _end(): Promise<void> {
        // 
    }
} 