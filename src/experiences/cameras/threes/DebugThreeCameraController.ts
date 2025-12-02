import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { KeyboardConstant } from "../../constants/doms/KeyboardConstant";
import { CameraId } from "../../constants/experiences/CameraId";
import MainThree from "../../engine/threes/MainThree";
import { KeyboardManager } from "../../managers/KeyboardManager";
import MouseManager from "../../managers/MouseManager";
import ThreeRaycasterManager from "../../managers/threes/ThreeRaycasterManager";
import ThreeCameraControllerBase, { type IThreeCameraOptions } from "./bases/ThreeCameraControllerBase";

export default class DebugThreeCameraController extends ThreeCameraControllerBase<OrbitControls> {
    //#region Constants
    //
    private static readonly _DEFAULT_CAMERA_POSITION: Vector3 = new Vector3(0, 1.5, 3);
    private static readonly _CONTROLS_DAMPING_FACTOR: number = 0.05;
    private static readonly _CONTROLS_CENTER_KEY: string = KeyboardConstant.Codes.ControlLeft;
    //
    //#endregion

    constructor(cameraOption: IThreeCameraOptions) {
        super(CameraId.THREE_DEBUG, cameraOption);
        this._camera.position.copy(DebugThreeCameraController._DEFAULT_CAMERA_POSITION);
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
        this._controls = new OrbitControls(this._camera, MainThree.DomElementContainer);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = DebugThreeCameraController._CONTROLS_DAMPING_FACTOR;
    }

    private readonly _onMouseDown = (): void => {
        if (KeyboardManager.IsKeyDown(DebugThreeCameraController._CONTROLS_CENTER_KEY)) {
            const intersect = ThreeRaycasterManager.CastFromCameraToMouse(MainThree.Scene.children);
            if (intersect.length > 0) {
                this._controls.target.copy(intersect[0].point);
                this._controls.update();
            }
        }
    }
}
