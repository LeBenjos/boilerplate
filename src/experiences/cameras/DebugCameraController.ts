import { OrbitControls } from "three/examples/jsm/Addons.js";
import { CameraId } from "../constants/experiences/CameraId";
import Experience from "../Experience";
import CameraControllerBase, { type ICameraOption } from "./bases/CameraControllerBase";

export default class DebugCameraController extends CameraControllerBase {
    private declare _controls: OrbitControls;

    constructor(cameraOption: ICameraOption = { type: "perspective", fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }) {
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

    public override enable(): void {
        super.enable();
        this._controls.enabled = true;
    }

    public override disable(): void {
        super.disable();
        this._controls.enabled = false;
    }

    public update(dt: number): void {
        super.update(dt);
        this._controls.update();
    }
}