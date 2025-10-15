import { Camera, CineonToneMapping, PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer, type WebGLRendererParameters } from "three";
import { ResizeManager } from "../managers/ResizeManager";
import Experience from "../Experience";

export default class Renderer extends WebGLRenderer {
    private _camera: Camera;

    constructor(camera: Camera, parameters: WebGLRendererParameters) {
        super(parameters);
        this.outputColorSpace = SRGBColorSpace;
        this.toneMapping = CineonToneMapping;
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
        this.setClearColor(0xFAFAFA, 0);

        this._camera = camera;

        this.resize();
    }

    public resize(): void {
        this.setSize(ResizeManager.Width, ResizeManager.Height);
        this.setPixelRatio(ResizeManager.PixelRatio);
    }

    public update(dt: number): void {
        this.render(Experience.Scene, this._camera);
    }
}