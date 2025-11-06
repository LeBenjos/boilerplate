import { OrbitControls } from "three/examples/jsm/Addons.js";
import { CameraId } from "../constants/experiences/CameraId";
import { CameraType } from "../constants/experiences/CameraType";
import Experience from "../Experience";
import CameraControllerBase, { type ICameraOption } from "./bases/CameraControllerBase";

export default class DebugCameraController extends CameraControllerBase<OrbitControls> {
    constructor(cameraOption: ICameraOption = { type: CameraType.PERSPECTIVE, fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }) {
        super(CameraId.DEBUG, cameraOption);
        this._camera.position.set(0, 0, 3);
        this._setControls();
        this.disable();
    }

    private _setControls(): void {
        this._controls = new OrbitControls(this._camera, Experience.DomElementContainer);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.05;
    }
}
