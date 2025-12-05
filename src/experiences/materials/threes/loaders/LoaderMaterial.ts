import gsap from "gsap";
import { Color, ShaderMaterial } from "three";
import LoaderManager from "../../../managers/LoaderManager";
import LoaderFragmentShader from "../../../shaders/threes/loaders/LoaderFragmentShader.glsl";
import LoaderVertexShader from "../../../shaders/threes/loaders/LoaderVertexShader.glsl";
import Action from "../../../tools/Action";

export default class LoaderMaterial extends ShaderMaterial {
    public readonly onGsapAnimationComplete: Action = new Action();

    //#region Constants
    //
    private static readonly _DEFAULT_UNIFORMS_ALPHA: number = 1;
    private static readonly _DEFAULT_UNIFORMS_COLOR: number = 0x3F79F3;
    private static readonly _GSAP_DURATION_FADE_OUT: number = 1.5;
    private static readonly _GSAP_EASE_FADE_OUT: string = "power2.in";
    //
    //#endregion

    constructor() {
        super({
            transparent: true,
            uniforms: {
                uAlpha: { value: LoaderMaterial._DEFAULT_UNIFORMS_ALPHA },
                uColor: { value: new Color(LoaderMaterial._DEFAULT_UNIFORMS_COLOR) },
            },
            vertexShader: LoaderVertexShader,
            fragmentShader: LoaderFragmentShader
        });

        LoaderManager.OnFinishLoad.add(this._onFinishLoad);
    }

    private readonly _onFinishLoad = (): void => {
        gsap.killTweensOf(this.uniforms.uAlpha);
        this.uniforms.uAlpha.value = 1;
        gsap.to(this.uniforms.uAlpha, {
            value: 0,
            duration: LoaderMaterial._GSAP_DURATION_FADE_OUT,
            ease: LoaderMaterial._GSAP_EASE_FADE_OUT,
            onComplete: this._onGsapAnimationComplete,
        });
    }

    private readonly _onGsapAnimationComplete = (): void => {
        this.onGsapAnimationComplete.execute();
    }
}
