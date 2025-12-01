import { Vector3 } from "three";
import { CameraId } from "../../constants/experiences/CameraId";
import ThreeCameraControllerBase, { type IThreeCameraOptions } from "./bases/ThreeCameraControllerBase";

export default class MainThreeCameraController extends ThreeCameraControllerBase {
    //#region Constants
    //
    private static readonly _DEFAULT_CONTAINER_POSITION: Vector3 = new Vector3(0, 1.5, 3);
    //
    //#endregion

    constructor(cameraOption: IThreeCameraOptions) {
        super(CameraId.THREE_MAIN, cameraOption);
        this._container.position.copy(MainThreeCameraController._DEFAULT_CONTAINER_POSITION);
    }

    public override update(dt: number): void {
        super.update(dt);
    }
}
