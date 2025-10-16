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
        if (isActive) CameraControllerManager._ActiveCameraController = cameraController;
    }

    public static Get(cameraId: CameraId): CameraControllerBase | undefined {
        return CameraControllerManager._CameraControllers.get(cameraId);
    }

    public static SetActiveCamera(cameraId: CameraId): void {
        const cameraController = CameraControllerManager._CameraControllers.get(cameraId);
        if (!cameraController) {
            console.warn(`CameraControllerManager: No camera controller found with id ${cameraId}`);
            return;
        }
        CameraControllerManager._ActiveCameraController = cameraController;
        CameraControllerManager.OnActiveCameraChange.execute(CameraControllerManager._ActiveCameraController);
    }

    //#region Getters
    //
    public static get ActiveCameraController(): CameraControllerBase { return CameraControllerManager._ActiveCameraController; }
    //
    //#endregion
}
