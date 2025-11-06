import { CameraId } from "../constants/experiences/CameraId";
import CameraControllerBase, { type ICameraOption } from "./bases/CameraControllerBase";

export default class MainCameraController extends CameraControllerBase {
    constructor(cameraOption: ICameraOption) {
        super(CameraId.MAIN, cameraOption);
        this._container.position.set(0, 1.5, 3);
    }

    public override update(dt: number): void {
        super.update(dt);
    }
}
