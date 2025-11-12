import { AssetId } from "../constants/experiences/AssetId";
import Experience from "../Experience";
import CameraControllerManager from "../managers/CameraControllerManager";
import DebugManager from "../managers/DebugManager";
import { KeyboardManager } from "../managers/KeyboardManager";
import MouseManager from "../managers/MouseManager";
import { ResizeManager } from "../managers/ResizeManager";
import ThreeAssetsManager from "../managers/ThreeAssetsManager";
import TickerManager from "../managers/TickerManager";
import AssetUtils from "../Utils/AssetUtils";

export default class InitCommand {
    public static async Begin(): Promise<void> {
        this._InitProxies();
        this._InitManagers();
        this._InitCommon();
        this._InitThree();

        Experience.Init();
    }

    private static async _InitProxies(): Promise<void> {
        // 
    }

    private static async _InitManagers(): Promise<void> {
        TickerManager.Init();
        KeyboardManager.Init();
        MouseManager.Init();
        DebugManager.Init();
        ResizeManager.Init();
        ThreeAssetsManager.Init();
        CameraControllerManager.Init();

        ThreeAssetsManager.OnFinishLoad.add(InitCommand._InitAfterLoad);
    }

    private static async _InitCommon(): Promise<void> {
        // 
    }

    private static async _InitThree(): Promise<void> {
        ThreeAssetsManager.AddHDR(AssetId.HDR_TEMPLATE, AssetUtils.GetPath("hdrs/template.hdr"));
        ThreeAssetsManager.AddModel(AssetId.GLTF_TEMPLATE, AssetUtils.GetPath("models/template.glb"));
        ThreeAssetsManager.AddTexture(AssetId.TEXTURE_TEMPLATE, AssetUtils.GetPath("textures/template.jpg"));
        ThreeAssetsManager.AddFont(AssetId.FONT_TEMPLATE, AssetUtils.GetPath("fonts/template.typeface.json"));

        ThreeAssetsManager.LoadAssets();
    }

    private static _InitAfterLoad = (): void => {
        //
    }
}
