import { OrbitControls } from "three/examples/jsm/Addons.js";
import { CameraId } from "../constants/experiences/CameraId";
import CameraControllerBase, { type ICameraOption } from "./bases/CameraControllerBase";

export default class MainCameraController extends CameraControllerBase {
    private declare _controls: OrbitControls;

    constructor(cameraOption: ICameraOption) {
        super(CameraId.MAIN, cameraOption);
        this._cameraContainer.position.set(0, 1.5, 3);
    }

    public override update(dt: number): void {
        super.update(dt);
    }
}