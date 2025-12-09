import { Vector3 } from "three";
import { CameraId } from "../../constants/experiences/CameraId";
import { CameraType } from "../../constants/experiences/CameraType";
import ThreeCameraControllerBase, { type IThreeCameraOptions } from "./bases/ThreeCameraControllerBase";

export default class LoaderThreeCameraController extends ThreeCameraControllerBase {
    //#region Constants
    //
    private static readonly _LOADER_CAMERA_OPTIONS: IThreeCameraOptions = {
        type: CameraType.PERSPECTIVE,
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1
    };
    private static readonly _DEFAULT_CONTAINER_POSITION: Vector3 = new Vector3(0, 0, 0);
    //
    //#endregion

    constructor(cameraOption: IThreeCameraOptions = LoaderThreeCameraController._LOADER_CAMERA_OPTIONS) {
        super(CameraId.THREE_LOADER, cameraOption);
        this._container.position.copy(LoaderThreeCameraController._DEFAULT_CONTAINER_POSITION);
    }

    public override update(dt: number): void {
        super.update(dt);
    }
}
