import type ThreeCameraControllerBase from '../../cameras/threes/bases/ThreeCameraControllerBase';
import type { CameraId } from '../../constants/experiences/CameraId';
import Action from '../../tools/Action';

export default class ThreeCameraControllerManager {
    private static readonly _ThreeCameraControllers = new Map<CameraId, ThreeCameraControllerBase>();
    private static _ActiveThreeCameraController: ThreeCameraControllerBase;

    public static readonly OnActiveThreeCameraControllerChange = new Action();

    public static Init(): void {
        ThreeCameraControllerManager._ThreeCameraControllers.clear();
    }

    public static Add(threeCameraController: ThreeCameraControllerBase, isActive = false): void {
        ThreeCameraControllerManager._ThreeCameraControllers.set(threeCameraController.cameraId, threeCameraController);
        if (isActive) ThreeCameraControllerManager.SetActiveCamera(threeCameraController.cameraId);
    }

    public static Get(cameraId: CameraId): ThreeCameraControllerBase {
        const threeCameraController = ThreeCameraControllerManager._ThreeCameraControllers.get(cameraId);
        if (!threeCameraController) {
            throw new Error(`CameraControllerManager: No camera found with id ${cameraId}`);
        }
        return threeCameraController;
    }

    public static SetActiveCamera(cameraId: CameraId): void {
        const threeCameraController = ThreeCameraControllerManager.Get(cameraId);
        ThreeCameraControllerManager._ActiveThreeCameraController?.disable();
        ThreeCameraControllerManager._ActiveThreeCameraController = threeCameraController;
        ThreeCameraControllerManager._ActiveThreeCameraController.enable();
        ThreeCameraControllerManager.OnActiveThreeCameraControllerChange.execute();
    }

    //#region Getters
    //
    public static get ActiveThreeCameraController(): ThreeCameraControllerBase {
        return ThreeCameraControllerManager._ActiveThreeCameraController;
    }
    //
    //#endregion
}
