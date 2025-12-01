import { MeshStandardMaterial, Scene } from "three";
import type ThreeCameraControllerBase from "./cameras/threes/bases/ThreeCameraControllerBase";
import type { IThreeCameraOptions } from "./cameras/threes/bases/ThreeCameraControllerBase";
import DebugThreeCameraController from "./cameras/threes/DebugThreeCameraController";
import MainThreeCameraController from "./cameras/threes/MainThreeCameraController";
import InitCommand from "./commands/InitCommand";
import { KeyboardConstant } from "./constants/doms/KeyboardConstant";
import { CameraId } from "./constants/experiences/CameraId";
import { CameraType } from "./constants/experiences/CameraType";
import DebugManager from "./managers/DebugManager";
import { KeyboardManager } from "./managers/KeyboardManager";
import LoaderManager from "./managers/LoaderManager";
import { ResizeManager } from "./managers/ResizeManager";
import ThreeCameraControllerManager from "./managers/threes/ThreeCameraControllerManager";
import TickerManager from "./managers/TickerManager";
import Renderer from "./renderers/threes/Renderer";
import LoaderThreeView from "./views/threes/LoaderThreeView";
import World from "./views/threes/world/World";

export default class Experience {
    private static _DomElementContainer: HTMLElement = document.querySelector("#app")!;
    private static _Scene: Scene;
    private static _CameraController: ThreeCameraControllerBase;
    private static _Renderer: Renderer;
    private static _Loader: LoaderThreeView;
    private static _World: World;
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
        InitCommand.Init();

        TickerManager.Add(Experience.Update);

        Experience._GenerateScene();
        Experience._GenerateLoaders();
        Experience._GenerateCameras();
        Experience._GenerateRenderer();

        Experience._OnResize();
        ResizeManager.OnResize.add(Experience._OnResize);

        LoaderManager.OnFinishLoad.add(Experience._GenerateWorld);
        LoaderManager.LoadAllAssets();

        if (DebugManager.IsActive) {
            window.experience = Experience;
            KeyboardManager.OnKeyUp.add(Experience._OnKeyUp);
        }
    }

    private static _GenerateScene(): void {
        Experience._Scene = new Scene();

        if (DebugManager.IsActive) {
            Experience._DebugWireframeMaterial = new MeshStandardMaterial({ wireframe: true, color: Experience._DEBUG_WIREFRAME_MATERIAL_COLOR });
        }
    }

    private static _GenerateLoaders(): void {
        Experience._Loader = new LoaderThreeView();
        Experience._Scene.add(Experience._Loader);
    }

    private static _GenerateCameras(): void {
        ThreeCameraControllerManager.Add(new MainThreeCameraController(Experience._MAIN_CAMERA_OPTIONS), true);
        Experience._CameraController = ThreeCameraControllerManager.Get(CameraId.THREE_MAIN);

        if (DebugManager.IsActive) {
            ThreeCameraControllerManager.Add(new DebugThreeCameraController(Experience._DEBUG_CAMERA_OPTIONS));
        }

        ThreeCameraControllerManager.OnActiveThreeCameraControllerChange.add(Experience._OnActiveCameraChange);
    }

    private static _GenerateRenderer(): void {
        Experience._Renderer = new Renderer(Experience._CameraController.camera, { antialias: true });
        Experience._DomElementContainer.appendChild(Experience._Renderer.domElement);
    }

    private static _GenerateWorld(): void {
        Experience._World = new World();
    }

    private static _OnActiveCameraChange = (): void => {
        Experience._CameraController = ThreeCameraControllerManager.ActiveCameraController;
        Experience._Renderer.setCamera(Experience._CameraController.camera);
        Experience._OnResize();
    }

    private static readonly _OnKeyUp = (e: KeyboardEvent): void => {
        if (DebugManager.IsActive) {
            if (KeyboardManager.AreAllKeysDown(Experience._TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS)) {
                ThreeCameraControllerManager.SetActiveCamera(Experience._CameraController.cameraId === CameraId.THREE_MAIN ? CameraId.THREE_DEBUG : CameraId.THREE_MAIN);
            } else if (KeyboardManager.AreAllKeysDown(Experience._TOGGLE_WIREFRAME_KEYS)) {
                if (Experience._Scene.overrideMaterial === null) {
                    Experience._Scene.overrideMaterial = Experience._DebugWireframeMaterial;
                } else {
                    Experience._Scene.overrideMaterial = null;
                }
            }
        }
    };

    private static _OnResize = (): void => {
        Experience._Renderer.domElement.width = window.innerWidth;
        Experience._Renderer.domElement.height = window.innerHeight;

        Experience._CameraController.resize();
        Experience._Renderer.resize();
    }

    public static Update = (dt: number): void => {
        Experience._CameraController.update(dt);
        if (Experience._World) Experience._World.update(dt);
        Experience._Renderer.update(dt);
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
