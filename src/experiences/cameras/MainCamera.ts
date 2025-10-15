import { Scene } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Ticker from "../tools/Ticker";
import CameraControllerBase, { type ICameraOption } from "./bases/CameraControllerBase";

export default class MainCameraController extends CameraControllerBase {
    private declare _controls: OrbitControls;

    constructor(scene: Scene, cameraOption: ICameraOption) {
        super(scene, cameraOption);
        this._cameraContainer.position.set(0, 0, 3);
    }

    public override update(dt: number): void {
        super.update(dt);
        this._cameraContainer.position.y = Math.sin(Ticker.ElapsedTime);
    }
}