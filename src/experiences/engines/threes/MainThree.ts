import { MeshStandardMaterial, Scene } from 'three';
import type ThreeCameraControllerBase from '../../cameras/threes/bases/ThreeCameraControllerBase';
import DebugThreeCameraController from '../../cameras/threes/DebugThreeCameraController';
import LoaderThreeCameraController from '../../cameras/threes/LoaderThreeCameraController';
import MainThreeCameraController from '../../cameras/threes/MainThreeCameraController';
import { KeyboardConstant } from '../../constants/doms/KeyboardConstant';
import { CameraId } from '../../constants/experiences/CameraId';
import { ViewId } from '../../constants/experiences/ViewId';
import DebugManager from '../../managers/DebugManager';
import { KeyboardManager } from '../../managers/KeyboardManager';
import { ResizeManager } from '../../managers/ResizeManager';
import ThreeCameraControllerManager from '../../managers/threes/ThreeCameraControllerManager';
import TickerManager from '../../managers/TickerManager';
import ViewProxy from '../../proxies/ViewProxy';
import WebGLRendererBase from '../../renderers/threes/bases/WebGLRendererBase';
import LoaderRenderer from '../../renderers/threes/LoaderRenderer';
import Renderer from '../../renderers/threes/Renderer';
import DomUtils from '../../utils/DomUtils';
import LoaderThreeView from '../../views/threes/loaders/LoaderThreeView';
import WorldThreeView from '../../views/threes/worlds/WorldThreeView';

export default class MainThree {
    private static _DomElementContainer: HTMLElement;
    private static _LoaderDomElementContainer: HTMLElement;
    private static _Scene: Scene;
    private static _LoaderScene: Scene;
    private static _CameraController: ThreeCameraControllerBase;
    private static _Renderer: Renderer;
    private static _LoaderRenderer: WebGLRendererBase;
    private static _DebugWireframeMaterial: MeshStandardMaterial;

    //#region Constants
    //
    private static readonly _DEBUG_WIREFRAME_MATERIAL_COLOR: number = 0x3f79f3;
    private static readonly _TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS: string[] = [
        KeyboardConstant.Codes.ShiftLeft,
        KeyboardConstant.Codes.KeyC,
    ];
    private static readonly _TOGGLE_WIREFRAME_KEYS: string[] = [
        KeyboardConstant.Codes.ShiftLeft,
        KeyboardConstant.Codes.KeyW,
    ];
    //
    //#endregion

    public static Init(): void {
        TickerManager.Add(MainThree.Update);

        MainThree._DomElementContainer = DomUtils.GetApp();
        MainThree._LoaderDomElementContainer = DomUtils.GetLoader();

        MainThree._GenerateScenes();
        MainThree._GenerateCameras();
        MainThree._GenerateRenderers();

        MainThree._OnResize();
        ResizeManager.OnResize.add(MainThree._OnResize);

        MainThree._GenerateViews();

        if (DebugManager.IsActive) {
            window.experience = MainThree;
            KeyboardManager.OnKeyUp.add(MainThree._OnKeyUp);
        }
    }

    private static _GenerateScenes(): void {
        MainThree._Scene = new Scene();
        MainThree._LoaderScene = new Scene();

        if (DebugManager.IsActive) {
            MainThree._DebugWireframeMaterial = new MeshStandardMaterial({
                wireframe: true,
                color: MainThree._DEBUG_WIREFRAME_MATERIAL_COLOR,
            });
        }
    }

    private static _GenerateViews(): void {
        ViewProxy.Add(ViewId.THREE_LOADER, LoaderThreeView);
        ViewProxy.Add(ViewId.THREE_WORLD, WorldThreeView);
    }

    private static _GenerateCameras(): void {
        ThreeCameraControllerManager.Add(new MainThreeCameraController(), true);
        ThreeCameraControllerManager.Add(new LoaderThreeCameraController());
        MainThree._CameraController = ThreeCameraControllerManager.Get(CameraId.THREE_MAIN);

        if (DebugManager.IsActive) {
            ThreeCameraControllerManager.Add(new DebugThreeCameraController());
        }

        ThreeCameraControllerManager.OnActiveThreeCameraControllerChange.add(MainThree._OnActiveCameraControllerChange);
    }

    private static _GenerateRenderers(): void {
        MainThree._Renderer = new Renderer(MainThree.Scene, MainThree._CameraController.camera, { antialias: true });
        MainThree._DomElementContainer.appendChild(MainThree._Renderer.domElement);

        MainThree._LoaderRenderer = new LoaderRenderer(
            MainThree.LoaderScene,
            ThreeCameraControllerManager.Get(CameraId.THREE_LOADER).camera
        );
        MainThree._LoaderDomElementContainer.appendChild(MainThree._LoaderRenderer.domElement);
    }

    private static _OnActiveCameraControllerChange = (): void => {
        MainThree._CameraController = ThreeCameraControllerManager.ActiveThreeCameraController;
        MainThree._Renderer.setCamera(MainThree._CameraController.camera);
        MainThree._OnResize();
    };

    private static readonly _OnKeyUp = (_e: KeyboardEvent): void => {
        if (DebugManager.IsActive) {
            if (KeyboardManager.AreAllKeysDown(MainThree._TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS)) {
                ThreeCameraControllerManager.SetActiveCamera(
                    MainThree._CameraController.cameraId === CameraId.THREE_MAIN
                        ? CameraId.THREE_DEBUG
                        : CameraId.THREE_MAIN
                );
            } else if (KeyboardManager.AreAllKeysDown(MainThree._TOGGLE_WIREFRAME_KEYS)) {
                if (MainThree._Scene.overrideMaterial === null) {
                    MainThree._Scene.overrideMaterial = MainThree._DebugWireframeMaterial;
                    MainThree._LoaderScene.overrideMaterial = MainThree._DebugWireframeMaterial;
                } else {
                    MainThree._Scene.overrideMaterial = null;
                    MainThree._LoaderScene.overrideMaterial = null;
                }
            }
        }
    };

    private static _OnResize = (): void => {
        MainThree._Renderer.domElement.width = window.innerWidth;
        MainThree._Renderer.domElement.height = window.innerHeight;

        MainThree._LoaderRenderer.domElement.width = window.innerWidth;
        MainThree._LoaderRenderer.domElement.height = window.innerHeight;

        MainThree._CameraController.resize();
        MainThree._Renderer.resize();
        MainThree._LoaderRenderer.resize();
    };

    public static Update = (dt: number): void => {
        MainThree._CameraController.update(dt);
        if (ViewProxy.Has(ViewId.THREE_WORLD)) ViewProxy.GetById<WorldThreeView>(ViewId.THREE_WORLD).update(dt);
        MainThree._Renderer.update(dt);
        MainThree._LoaderRenderer.update(dt);
    };

    //#region Getters
    //
    public static get DomElementContainer(): HTMLElement {
        return this._DomElementContainer;
    }
    public static get Scene(): Scene {
        return this._Scene;
    }
    public static get LoaderScene(): Scene {
        return this._LoaderScene;
    }
    public static get Renderer(): WebGLRendererBase {
        return this._Renderer;
    }
    public static get CameraController(): ThreeCameraControllerBase {
        return this._CameraController;
    }
    //
    //#endregion
}
