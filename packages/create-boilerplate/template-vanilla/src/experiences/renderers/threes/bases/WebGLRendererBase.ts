import { Camera, Scene, WebGLRenderer, type WebGLRendererParameters } from 'three';
import { ResizeManager } from '../../../managers/ResizeManager';

export default abstract class WebGLRendererBase extends WebGLRenderer {
    private readonly _scene: Scene;
    private _camera: Camera;

    constructor(scene: Scene, camera: Camera, parameters: WebGLRendererParameters = {}) {
        super(parameters);

        this._scene = scene;
        this._camera = camera;

        this.resize();
    }

    public setCamera(camera: Camera): void {
        this._camera = camera;
    }

    public resize(): void {
        this.setSize(ResizeManager.Width, ResizeManager.Height);
        this.setPixelRatio(ResizeManager.PixelRatio);
    }

    public update(_dt: number): void {
        this.render(this._scene, this._camera);
    }
}
