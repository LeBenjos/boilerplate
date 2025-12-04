import { MeshStandardMaterial, Scene } from "three";
import type ThreeCameraControllerBase from "../../cameras/threes/bases/ThreeCameraControllerBase";
import type { IThreeCameraOptions } from "../../cameras/threes/bases/ThreeCameraControllerBase";
import DebugThreeCameraController from "../../cameras/threes/DebugThreeCameraController";
import MainThreeCameraController from "../../cameras/threes/MainThreeCameraController";
import { KeyboardConstant } from "../../constants/doms/KeyboardConstant";
import { CameraId } from "../../constants/experiences/CameraId";
import { CameraType } from "../../constants/experiences/CameraType";
import DebugManager from "../../managers/DebugManager";
import { KeyboardManager } from "../../managers/KeyboardManager";
import LoaderManager from "../../managers/LoaderManager";
import { ResizeManager } from "../../managers/ResizeManager";
import ThreeCameraControllerManager from "../../managers/threes/ThreeCameraControllerManager";
import TickerManager from "../../managers/TickerManager";
import Renderer from "../../renderers/threes/Renderer";
import DomUtils from "../../Utils/DomUtils";
import LoaderThreeView from "../../views/threes/loaders/LoaderThreeView";
import WorldThreeView from "../../views/threes/worlds/WorldThreeView";

export default class MainThree {
    private static _DomElementContainer: HTMLElement;
    private static _Scene: Scene;
    private static _CameraController: ThreeCameraControllerBase;
    private static _Renderer: Renderer;
    private static _LoaderThreeView: LoaderThreeView;
    private static _WorldThreeView: WorldThreeView;
    private static _DebugWireframeMaterial: MeshStandardMaterial;

    //#region Constants
    //
    private static readonly _DEBUG_WIREFRAME_MATERIAL_COLOR: number = 0x3F79F3;
    private static readonly _MAIN_CAMERA_OPTIONS: IThreeCameraOptions = {
        type: CameraType.PERSPECTIVE,
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000
    };
    private static readonly _DEBUG_CAMERA_OPTIONS: IThreeCameraOptions = {
        type: CameraType.PERSPECTIVE,
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000
    };
    private static readonly _TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS: string[] = [KeyboardConstant.Codes.ShiftLeft, KeyboardConstant.Codes.KeyC];
    private static readonly _TOGGLE_WIREFRAME_KEYS: string[] = [KeyboardConstant.Codes.ShiftLeft, KeyboardConstant.Codes.KeyW];
    //
    //#endregion

    public static Init(): void {
        TickerManager.Add(MainThree.Update);

        MainThree._DomElementContainer = DomUtils.GetApp();

        MainThree._GenerateScene();
        MainThree._GenerateLoaders();
        MainThree._GenerateCameras();
        MainThree._GenerateRenderer();

        MainThree._OnResize();
        ResizeManager.OnResize.add(MainThree._OnResize);

        LoaderManager.OnFinishLoad.add(MainThree._GenerateWorld);

        if (DebugManager.IsActive) {
            window.experience = MainThree;
            KeyboardManager.OnKeyUp.add(MainThree._OnKeyUp);
        }
    }

    private static _GenerateScene(): void {
        MainThree._Scene = new Scene();

        if (DebugManager.IsActive) {
            MainThree._DebugWireframeMaterial = new MeshStandardMaterial({ wireframe: true, color: MainThree._DEBUG_WIREFRAME_MATERIAL_COLOR });
        }
    }

    private static _GenerateLoaders(): void {
        MainThree._LoaderThreeView = new LoaderThreeView();
    }

    private static _GenerateCameras(): void {
        ThreeCameraControllerManager.Add(new MainThreeCameraController(MainThree._MAIN_CAMERA_OPTIONS), true);
        MainThree._CameraController = ThreeCameraControllerManager.Get(CameraId.THREE_MAIN);

        if (DebugManager.IsActive) {
            ThreeCameraControllerManager.Add(new DebugThreeCameraController(MainThree._DEBUG_CAMERA_OPTIONS));
        }

        ThreeCameraControllerManager.OnActiveThreeCameraControllerChange.add(MainThree._OnActiveCameraControllerChange);
    }

    private static _GenerateRenderer(): void {
        MainThree._Renderer = new Renderer(MainThree._CameraController.camera, { antialias: true });
        MainThree._DomElementContainer.appendChild(MainThree._Renderer.domElement);
    }

    private static _GenerateWorld(): void {
        MainThree._WorldThreeView = new WorldThreeView();
    }

    private static _OnActiveCameraControllerChange = (): void => {
        MainThree._CameraController = ThreeCameraControllerManager.ActiveThreeCameraController;
        MainThree._Renderer.setCamera(MainThree._CameraController.camera);
        MainThree._OnResize();
    }

    private static readonly _OnKeyUp = (e: KeyboardEvent): void => {
        if (DebugManager.IsActive) {
            if (KeyboardManager.AreAllKeysDown(MainThree._TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS)) {
                ThreeCameraControllerManager.SetActiveCamera(MainThree._CameraController.cameraId === CameraId.THREE_MAIN ? CameraId.THREE_DEBUG : CameraId.THREE_MAIN);
            } else if (KeyboardManager.AreAllKeysDown(MainThree._TOGGLE_WIREFRAME_KEYS)) {
                if (MainThree._Scene.overrideMaterial === null) {
                    MainThree._Scene.overrideMaterial = MainThree._DebugWireframeMaterial;
                } else {
                    MainThree._Scene.overrideMaterial = null;
                }
            }
        }
    };

    private static _OnResize = (): void => {
        MainThree._Renderer.domElement.width = window.innerWidth;
        MainThree._Renderer.domElement.height = window.innerHeight;

        MainThree._CameraController.resize();
        MainThree._Renderer.resize();
    }

    public static Update = (dt: number): void => {
        MainThree._CameraController.update(dt);
        if (MainThree._WorldThreeView) MainThree._WorldThreeView.update(dt);
        MainThree._Renderer.update(dt);
    }

    //#region Getters
    //
    public static get Scene(): Scene { return this._Scene; }
    public static get DomElementContainer(): HTMLElement { return this._DomElementContainer; }
    public static get Renderer(): Renderer { return this._Renderer; }
    public static get CameraController(): ThreeCameraControllerBase { return this._CameraController; }
    //
    //#endregion
}
