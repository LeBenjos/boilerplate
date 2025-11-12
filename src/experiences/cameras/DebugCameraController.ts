import { OrbitControls } from "three/examples/jsm/Addons.js";
import { KeyboardConstant } from "../constants/doms/KeyboardConstant";
import { CameraId } from "../constants/experiences/CameraId";
import { CameraType } from "../constants/experiences/CameraType";
import Experience from "../Experience";
import { KeyboardManager } from "../managers/KeyboardManager";
import MouseManager from "../managers/MouseManager";
import ThreeRaycasterManager from "../managers/ThreeRaycasterManager";
import CameraControllerBase, { type ICameraOption } from "./bases/CameraControllerBase";

export default class DebugCameraController extends CameraControllerBase<OrbitControls> {
    constructor(cameraOption: ICameraOption = { type: CameraType.PERSPECTIVE, fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }) {
        super(CameraId.DEBUG, cameraOption);
        this._camera.position.set(0, 0, 3);
        this._setControls();
        this.disable();
    }

    public override enable(): void {
        super.enable();
        MouseManager.OnMouseDown.add(this._onMouseDown);
    }

    public override disable(): void {
        super.disable();
        MouseManager.OnMouseDown.remove(this._onMouseDown);
    }

    private _setControls(): void {
        this._controls = new OrbitControls(this._camera, Experience.DomElementContainer);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.05;
    }

    private _onMouseDown = (): void => {
        if (KeyboardManager.IsKeyDown(KeyboardConstant.Codes.ControlLeft)) {
            const intersect = ThreeRaycasterManager.Cast(Experience.Scene.children);
            if (intersect.length > 0) {
                this._controls.target.copy(intersect[0].point);
                this._controls.update();
            }
        }
    };
}
