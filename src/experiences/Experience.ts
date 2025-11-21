import { MeshStandardMaterial, Scene } from "three";
import type CameraControllerBase from "./cameras/bases/CameraControllerBase";
import DebugCameraController from "./cameras/DebugCameraController";
import MainCameraController from "./cameras/MainCameraController";
import { KeyboardConstant } from "./constants/doms/KeyboardConstant";
import { CameraId } from "./constants/experiences/CameraId";
import { CameraType } from "./constants/experiences/CameraType";
import CameraControllerManager from "./managers/CameraControllerManager";
import DebugManager from "./managers/DebugManager";
import { KeyboardManager } from "./managers/KeyboardManager";
import LoaderManager from "./managers/LoaderManager";
import { ResizeManager } from "./managers/ResizeManager";
import TickerManager from "./managers/TickerManager";
import Renderer from "./renderers/Renderer";
import LoaderThreeView from "./views/threes/LoaderThreeView";
import World from "./views/threes/world/World";

export default class Experience {
    private static _DomElementContainer: HTMLElement = document.querySelector("#app")!;
    private static _Scene: Scene;
    private static _CameraController: CameraControllerBase;
    private static _Renderer: Renderer;
    private static _Loader: LoaderThreeView;
    private static _World: World;
    private static _DebugWireframeMaterial: MeshStandardMaterial;

    public static Init(): void {
        window.experience = Experience;
        TickerManager.Add(Experience.Update);

        Experience._GenerateScene();
        Experience._GenerateLoaders();
        Experience._GenerateCameras();
        Experience._GenerateRenderer();
        LoaderManager.OnFinishLoad.add(Experience._GenerateWorld);

        Experience._OnResize();
        ResizeManager.OnResize.add(Experience._OnResize);

        if (DebugManager.IsActive) {
            KeyboardManager.OnKeyUp.add(Experience._OnKeyUp);
        }
    }

    private static _GenerateScene(): void {
        Experience._Scene = new Scene();

        if (DebugManager.IsActive) {
            Experience._DebugWireframeMaterial = new MeshStandardMaterial({ wireframe: true, color: 0x3F79F3 });
        }
    }

    private static _GenerateLoaders(): void {
        Experience._Loader = new LoaderThreeView();
        Experience._Scene.add(Experience._Loader);
    }

    private static _GenerateCameras(): void {
        CameraControllerManager.Add(new MainCameraController({ type: CameraType.PERSPECTIVE, fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }), true);
        Experience._CameraController = CameraControllerManager.Get(CameraId.MAIN);

        if (DebugManager.IsActive) {
            CameraControllerManager.Add(new DebugCameraController({ type: CameraType.PERSPECTIVE, fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }));
        }

        CameraControllerManager.OnActiveCameraChange.add(Experience._OnActiveCameraChange);
    }

    private static _GenerateRenderer(): void {
        Experience._Renderer = new Renderer(Experience._CameraController.camera, { antialias: true });
        Experience._DomElementContainer.appendChild(Experience._Renderer.domElement);
    }

    private static _GenerateWorld(): void {
        Experience._World = new World();
    }

    private static _OnActiveCameraChange = (): void => {
        Experience._CameraController = CameraControllerManager.ActiveCameraController;
        Experience._Renderer.setCamera(Experience._CameraController.camera);
        Experience._OnResize();
    }

    private static readonly _OnKeyUp = (e: KeyboardEvent): void => {
        if (DebugManager.IsActive) {
            if (KeyboardManager.AreAllKeysDown([KeyboardConstant.Codes.ShiftLeft, KeyboardConstant.Codes.KeyC])) {
                CameraControllerManager.SetActiveCamera(Experience._CameraController.cameraId === CameraId.MAIN ? CameraId.DEBUG : CameraId.MAIN);
            } else if (KeyboardManager.AreAllKeysDown([KeyboardConstant.Codes.ShiftLeft, KeyboardConstant.Codes.KeyW])) {
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
    public static get CameraController(): CameraControllerBase { return this._CameraController; }
    //
    //#endregion
}
