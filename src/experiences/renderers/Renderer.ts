import { Camera, CineonToneMapping, PCFSoftShadowMap, Scene, SRGBColorSpace, WebGLRenderer, type WebGLRendererParameters } from "three";
import { ResizeManager } from "../managers/ResizeManager";

export default class Renderer extends WebGLRenderer {
    private _scene: Scene;
    private _camera: Camera;

    constructor(scene: Scene, camera: Camera, parameters: WebGLRendererParameters) {
        super(parameters);
        this.outputColorSpace = SRGBColorSpace;
        this.toneMapping = CineonToneMapping;
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
        this.setClearColor(0xFAFAFA, 0);

        this._scene = scene;
        this._camera = camera;

        this.resize();
    }

    public resize(): void {
        this.setSize(ResizeManager.Width, ResizeManager.Height);
        this.setPixelRatio(ResizeManager.PixelRatio);
    }

    public update(dt: number): void {
        this.render(this._scene, this._camera);
    }
}