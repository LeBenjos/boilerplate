import type CameraControllerBase from "../cameras/bases/CameraControllerBase";
import type { CameraId } from "../constants/experiences/CameraId";
import { Action } from "../tools/Action";

export default class CameraControllerManager {
    private static _CameraControllers: Map<CameraId, CameraControllerBase> = new Map();
    private static _ActiveCameraController: CameraControllerBase;

    public static readonly OnActiveCameraChange = new Action();

    public static Init(): void {
        //
    }

    public static Add(cameraController: CameraControllerBase, isActive: boolean = false): void {
        CameraControllerManager._CameraControllers.set(cameraController.cameraId, cameraController);
        if (isActive) CameraControllerManager.SetActiveCamera(cameraController.cameraId);
    }

    public static Get(cameraId: CameraId): CameraControllerBase {
        const cameraController = CameraControllerManager._CameraControllers.get(cameraId);
        if (!cameraController) {
            throw new Error(`CameraControllerManager: No camera found with id ${cameraId}`);
        }
        return cameraController;
    }

    public static SetActiveCamera(cameraId: CameraId): void {
        const cameraController = CameraControllerManager.Get(cameraId);
        CameraControllerManager._ActiveCameraController?.disable();
        CameraControllerManager._ActiveCameraController = cameraController;
        CameraControllerManager._ActiveCameraController.enable();
        CameraControllerManager.OnActiveCameraChange.execute(CameraControllerManager._ActiveCameraController);
    }

    //#region Getters
    //
    public static get ActiveCameraController(): CameraControllerBase { return CameraControllerManager._ActiveCameraController; }
    //
    //#endregion
}
