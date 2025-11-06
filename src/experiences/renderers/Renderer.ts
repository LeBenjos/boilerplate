import { ACESFilmicToneMapping, AgXToneMapping, Camera, CineonToneMapping, CustomToneMapping, LinearSRGBColorSpace, LinearToneMapping, NeutralToneMapping, NoToneMapping, PCFSoftShadowMap, ReinhardToneMapping, SRGBColorSpace, WebGLRenderer, type ColorSpace, type ToneMapping, type WebGLRendererParameters } from "three";
import Experience from "../Experience";
import DebugManager from "../managers/DebugManager";
import { ResizeManager } from "../managers/ResizeManager";

export default class Renderer extends WebGLRenderer {
    private _camera: Camera;

    constructor(camera: Camera, parameters: WebGLRendererParameters) {
        super(parameters);
        this.toneMapping = CineonToneMapping;
        this.toneMappingExposure = 1;
        this.outputColorSpace = SRGBColorSpace;
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
        this.setClearColor(0xFAFAFA, 0);

        this._camera = camera;

        this.resize();

        if (DebugManager.IsActive) {
            const rendererFolder = DebugManager.Gui.addFolder("Renderer");
            rendererFolder.add(this, "toneMapping", { NoToneMapping, LinearToneMapping, ReinhardToneMapping, CineonToneMapping, ACESFilmicToneMapping, CustomToneMapping, AgXToneMapping, NeutralToneMapping }).onChange((value: ToneMapping) => {
                this.toneMapping = value;
            });
            rendererFolder.add(this, "toneMappingExposure", 0, 10, 0.001);
            rendererFolder.add(this, "outputColorSpace", { SRGBColorSpace, LinearSRGBColorSpace }).onChange((value: ColorSpace) => {
                this.outputColorSpace = value;
            });
        }
    }

    public setCamera(camera: Camera) {
        this._camera = camera;
    }

    public resize(): void {
        this.setSize(ResizeManager.Width, ResizeManager.Height);
        this.setPixelRatio(ResizeManager.PixelRatio);
    }

    public update(dt: number): void {
        this.render(Experience.Scene, this._camera);
    }
}
