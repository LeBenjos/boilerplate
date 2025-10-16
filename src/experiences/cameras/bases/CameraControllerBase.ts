import { Object3D, OrthographicCamera, PerspectiveCamera } from "three";
import type { CameraId } from "../../constants/experiences/CameraId";
import Experience from "../../Experience";
import { ResizeManager } from "../../managers/ResizeManager";

export interface ICameraOption {
    type: "perspective" | "orthographic";
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}

export default abstract class CameraControllerBase extends Object3D {
    private readonly _cameraId: CameraId;
    protected _camera: PerspectiveCamera | OrthographicCamera;
    protected _cameraContainer: Object3D;

    constructor(cameraId: CameraId, cameraOption: ICameraOption = { type: "perspective", fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }) {
        super();
        this._cameraId = cameraId;
        this._cameraContainer = new Object3D();
        if (cameraOption.type === "perspective") this._camera = new PerspectiveCamera(cameraOption.fov, cameraOption.aspect, cameraOption.near, cameraOption.far);
        else this._camera = new OrthographicCamera(cameraOption.left, cameraOption.right, cameraOption.top, cameraOption.bottom, cameraOption.near, cameraOption.far);

        this._cameraContainer.add(this._camera);
        this.add(this._cameraContainer);
        Experience.Scene.add(this);
    }

    public resize(): void {
        if (this._camera instanceof PerspectiveCamera) this._camera.aspect = ResizeManager.Width / ResizeManager.Height;
        this._camera.updateProjectionMatrix();
    }

    public update(dt: number): void {
        //
    }

    //#region Getters
    //
    public get cameraId(): CameraId { return this._cameraId; }
    public get camera(): PerspectiveCamera | OrthographicCamera { return this._camera; }
    //
    //#endregion
}