import { Object3D, OrthographicCamera, PerspectiveCamera } from "three";
import type { CameraId } from "../../constants/experiences/CameraId";
import { CameraType } from "../../constants/experiences/CameraType";
import Experience from "../../Experience";
import { ResizeManager } from "../../managers/ResizeManager";

export interface ICameraOption {
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

export interface IControls {
    update(delta?: number): void;
    enabled: boolean;
    dispose(): void;
}

export default abstract class CameraControllerBase<T extends IControls = IControls> extends Object3D {
    protected readonly _cameraId: CameraId;
    protected _camera: PerspectiveCamera | OrthographicCamera;
    protected _container: Object3D;
    protected declare _controls: T;

    constructor(cameraId: CameraId, cameraOption: ICameraOption = { type: CameraType.PERSPECTIVE, fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }) {
        super();
        this._cameraId = cameraId;
        this._container = new Object3D();
        if (cameraOption.type === CameraType.PERSPECTIVE) this._camera = new PerspectiveCamera(cameraOption.fov, cameraOption.aspect, cameraOption.near, cameraOption.far);
        else this._camera = new OrthographicCamera(cameraOption.left, cameraOption.right, cameraOption.top, cameraOption.bottom, cameraOption.near, cameraOption.far);

        this._container.add(this._camera);
        this.add(this._container);
        Experience.Scene.add(this);
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
