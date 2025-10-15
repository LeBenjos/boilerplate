import { Object3D, OrthographicCamera, PerspectiveCamera, Scene } from "three";
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

export default class CameraControllerBase extends Object3D {
    protected _camera: PerspectiveCamera | OrthographicCamera;
    protected _cameraContainer: Object3D;

    constructor(scene: Scene, cameraOption: ICameraOption = { type: "perspective", fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }) {
        super();
        this._cameraContainer = new Object3D();
        if (cameraOption.type === "perspective") this._camera = new PerspectiveCamera(cameraOption.fov, cameraOption.aspect, cameraOption.near, cameraOption.far);
        else this._camera = new OrthographicCamera(cameraOption.left, cameraOption.right, cameraOption.top, cameraOption.bottom, cameraOption.near, cameraOption.far);

        this._cameraContainer.add(this._camera);
        this.add(this._cameraContainer);
        scene.add(this);
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
    public get camera(): PerspectiveCamera | OrthographicCamera { return this._camera; }
    //
    //#endregion
}