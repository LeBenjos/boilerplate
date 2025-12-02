import { Object3D, OrthographicCamera, PerspectiveCamera } from "three";
import type { CameraId } from "../../../constants/experiences/CameraId";
import { CameraType } from "../../../constants/experiences/CameraType";
import MainThree from "../../../engine/threes/MainThree";
import { ResizeManager } from "../../../managers/ResizeManager";

export interface IThreeCameraOptions {
    type: CameraType;
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}

export interface IThreeControls {
    update(delta?: number): void;
    enabled: boolean;
    dispose(): void;
}

export default abstract class ThreeCameraControllerBase<T extends IThreeControls = IThreeControls> extends Object3D {
    protected readonly _cameraId: CameraId;
    protected declare _camera: PerspectiveCamera | OrthographicCamera;
    protected declare _container: Object3D;
    protected declare _controls: T;

    //#region Constants
    //
    private static readonly _DEFAULT_CAMERA_OPTIONS: IThreeCameraOptions = {
        type: CameraType.PERSPECTIVE,
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000
    };
    //
    //#endregion

    constructor(cameraId: CameraId, cameraOptions: IThreeCameraOptions = ThreeCameraControllerBase._DEFAULT_CAMERA_OPTIONS) {
        super();
        this._cameraId = cameraId;

        this._generateContainer();
        this._generateCamera(cameraOptions);

        MainThree.Scene.add(this);
    }

    private _generateContainer(): void {
        this._container = new Object3D();
        this.add(this._container);
    }

    private _generateCamera(cameraOptions: IThreeCameraOptions): void {
        if (cameraOptions.type === CameraType.PERSPECTIVE) {
            this._camera = new PerspectiveCamera(cameraOptions.fov, cameraOptions.aspect, cameraOptions.near, cameraOptions.far);
        } else {
            this._camera = new OrthographicCamera(cameraOptions.left, cameraOptions.right, cameraOptions.top, cameraOptions.bottom, cameraOptions.near, cameraOptions.far);
        }
        this._container.add(this._camera);
    }

    public enable(): void {
        if (this._controls) this._controls.enabled = true;
    }

    public disable(): void {
        if (this._controls) this._controls.enabled = false;
    }

    public resize(): void {
        if (this._camera instanceof PerspectiveCamera) this._camera.aspect = ResizeManager.Width / ResizeManager.Height;
        this._camera.updateProjectionMatrix();
    }

    public update(dt: number): void {
        if (this._controls) this._controls.update();
    }

    //#region Getters
    //
    public get cameraId(): CameraId { return this._cameraId; }
    public get camera(): PerspectiveCamera | OrthographicCamera { return this._camera; }
    //
    //#endregion
}
