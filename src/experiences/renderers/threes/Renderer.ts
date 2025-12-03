import { ACESFilmicToneMapping, AgXToneMapping, Camera, CineonToneMapping, CustomToneMapping, LinearSRGBColorSpace, LinearToneMapping, NeutralToneMapping, NoToneMapping, PCFSoftShadowMap, ReinhardToneMapping, SRGBColorSpace, WebGLRenderer, type ColorSpace, type ToneMapping, type WebGLRendererParameters } from "three";
import MainThree from "../../engines/threes/MainThree";
import DebugManager from "../../managers/DebugManager";
import { ResizeManager } from "../../managers/ResizeManager";

export default class Renderer extends WebGLRenderer {
    private _camera: Camera;

    //#region Constants
    //
    private static readonly _DEFAULT_TONE_MAPPING = CineonToneMapping;
    private static readonly _DEFAULT_OUTPUT_COLOR_SPACE = SRGBColorSpace;
    private static readonly _DEFAULT_SHADOW_MAP_TYPE = PCFSoftShadowMap;
    private static readonly _DEFAULT_TONE_MAPPING_EXPOSURE = 1;
    private static readonly _DEFAULT_CLEAR_COLOR = 0xFAFAFA;
    private static readonly _DEFAULT_CLEAR_ALPHA = 0;
    // 
    //#endregion

    constructor(camera: Camera, parameters: WebGLRendererParameters) {
        super(parameters);
        this.toneMapping = Renderer._DEFAULT_TONE_MAPPING;
        this.toneMappingExposure = Renderer._DEFAULT_TONE_MAPPING_EXPOSURE;
        this.outputColorSpace = Renderer._DEFAULT_OUTPUT_COLOR_SPACE;
        this.shadowMap.enabled = true;
        this.shadowMap.type = Renderer._DEFAULT_SHADOW_MAP_TYPE;
        this.setClearColor(Renderer._DEFAULT_CLEAR_COLOR, Renderer._DEFAULT_CLEAR_ALPHA);

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
        const isDebug = DebugManager.IsActive;
        if (isDebug) DebugManager.BeginThreePerf();
        this.render(MainThree.Scene, this._camera);
        if (isDebug) DebugManager.EndThreePerf();
    }
}
