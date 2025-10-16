import { Scene } from "three";
import type CameraControllerBase from "./cameras/bases/CameraControllerBase";
import DebugCameraController from "./cameras/DebugCameraController";
import MainCameraController from "./cameras/MainCameraController";
import { KeyboardConstant } from "./constants/doms/KeyboardConstant";
import { CameraId } from "./constants/experiences/CameraId";
import CameraControllerManager from "./managers/CameraControllerManager";
import DebugManager from "./managers/DebugManager";
import { KeyboardManager } from "./managers/KeyboardManager";
import { ResizeManager } from "./managers/ResizeManager";
import ThreeAssetsManager from "./managers/ThreeAssetsManager";
import Renderer from "./renderers/Renderer";
import World from "./worlds/World";

export default class Experience {
    private static _DomElementContainer: HTMLElement = document.querySelector("#app")!;
    private static _Scene: Scene;
    private static _CameraController: CameraControllerBase;
    private static _Renderer: Renderer;
    private static _World: World;

    public static Init(): void {
        window.experience = Experience;

        Experience._Scene = new Scene();

        Experience._CameraController = new MainCameraController({ type: "perspective", fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 });
        CameraControllerManager.Add(Experience._CameraController, true);
        if (DebugManager.IsActive) {
            CameraControllerManager.Add(new DebugCameraController({ type: "perspective", fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }));
            KeyboardManager.OnKeyUp.add(Experience._OnKeyUp);
        }
        CameraControllerManager.OnActiveCameraChange.add(Experience._OnActiveCameraChange);

        Experience._Renderer = new Renderer(Experience._CameraController.camera, { antialias: true });
        Experience._DomElementContainer.appendChild(Experience._Renderer.domElement);

        Experience._onResize();
        ResizeManager.OnResize.add(Experience._onResize);
        ThreeAssetsManager.OnFinishLoad.add(Experience._generateWorld);
    }

    private static readonly _OnKeyUp = (e: KeyboardEvent): void => {
        if (e.shiftKey && (e.code === KeyboardConstant.Codes.KeyC)) {
            CameraControllerManager.SetActiveCamera(Experience._CameraController.cameraId === CameraId.MAIN ? CameraId.DEBUG : CameraId.MAIN);
        }
    };

    private static _generateWorld = (): void => {
        Experience._World = new World();
    }

    private static _OnActiveCameraChange = (): void => {
        Experience._CameraController = CameraControllerManager.ActiveCameraController;
        Experience._Renderer.setCamera(Experience._CameraController.camera);
        Experience._onResize();
    }

    private static _onResize = (): void => {
        Experience._Renderer.domElement.width = window.innerWidth;
        Experience._Renderer.domElement.height = window.innerHeight;

        Experience._CameraController.resize();
        Experience._Renderer.resize();
    }

    public update(dt: number): void {
        Experience._CameraController.update(dt);
        Experience._Renderer.update(dt);
        if (Experience._World) Experience._World.update(dt);
    }

    //#region Getters
    //
    public static get Scene(): Scene { return this._Scene; }
    public static get DomElementContainer(): HTMLElement { return this._DomElementContainer; }
    //
    //#endregion
}
