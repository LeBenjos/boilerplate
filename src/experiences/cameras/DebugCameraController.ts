import { OrbitControls } from "three/examples/jsm/Addons.js";
import CameraControllerBase, { type ICameraOption } from "./bases/CameraControllerBase";

export default class DebugCameraController extends CameraControllerBase {
    private declare _controls: OrbitControls;

    constructor(cameraOption: ICameraOption = { type: "perspective", fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }) {
        super(cameraOption);
        this._camera.position.set(0, 0, 3);
        this._setControls();
    }

    private _setControls(): void {
        this._controls = new OrbitControls(this._camera, document.body);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.05;
    }

    public update(dt: number): void {
        super.update(dt);
        this._controls.update();
    }
}