import { AssetUtils } from '@benjos/cookware';
import { AssetId } from '../constants/experiences/AssetId';
import DebugManager from '../managers/DebugManager';
import { KeyboardManager } from '../managers/KeyboardManager';
import LoaderManager from '../managers/LoaderManager';
import MouseManager from '../managers/MouseManager';
import { ResizeManager } from '../managers/ResizeManager';
import ThreeAssetsManager from '../managers/threes/ThreeAssetsManager';
import ThreeCameraControllerManager from '../managers/threes/ThreeCameraControllerManager';
import ThreeRaycasterManager from '../managers/threes/ThreeRaycasterManager';
import TickerManager from '../managers/TickerManager';
import ViewProxy from '../proxies/ViewProxy';

export default class InitCommand {
    public static Init(): void {
        InitCommand._InitUtils();
        InitCommand._InitProxies();
        InitCommand._InitManagers();
        InitCommand._InitCommon();
        InitCommand._InitThree();
    }

    private static _InitUtils(): void {
        AssetUtils.init();
    }

    private static _InitProxies(): void {
        ViewProxy.Init();
    }

    private static _InitManagers(): void {
        TickerManager.Init();
        KeyboardManager.Init();
        MouseManager.Init();
        ThreeAssetsManager.Init();
        ThreeCameraControllerManager.Init();
        ResizeManager.Init();
        DebugManager.Init();
        ThreeRaycasterManager.Init();
        LoaderManager.Init();
    }

    private static _InitCommon(): void {
        //
    }

    private static _InitThree(): void {
        ThreeAssetsManager.AddHDR(AssetId.THREE_HDR_TEMPLATE, AssetUtils.getPath('hdrs/template.hdr'));
        ThreeAssetsManager.AddModel(AssetId.THREE_GLTF_TEMPLATE, AssetUtils.getPath('models/template.glb'));
        ThreeAssetsManager.AddTexture(AssetId.THREE_TEXTURE_TEMPLATE, AssetUtils.getPath('textures/template.jpg'));
        ThreeAssetsManager.AddFont(AssetId.THREE_FONT_TEMPLATE, AssetUtils.getPath('fonts/template.typeface.json'));
    }
}
