import gsap from "gsap";
import { Color, ShaderMaterial } from "three";
import { ViewId } from "../../../constants/experiences/ViewId";
import LoaderManager from "../../../managers/LoaderManager";
import ViewProxy from "../../../proxies/ViewProxy";
import LoaderFragmentShader from "../../../shaders/threes/loaders/LoaderFragmentShader.glsl";
import LoaderVertexShader from "../../../shaders/threes/loaders/LoaderVertexShader.glsl";
import Action from "../../../tools/Action";
import type LoaderHTMLView from "../../../views/htmls/loaders/LoaderHTMLView";

export default class LoaderMaterial extends ShaderMaterial {
    public readonly onGsapAnimationComplete: Action = new Action();

    //#region Constants
    //
    private static readonly _DEFAULT_UNIFORMS_ALPHA: number = 1;
    private static readonly _DEFAULT_UNIFORMS_COLOR: number = 0x3F79F3;
    private static readonly _GSAP_DURATION_FADE_IN: number = 0.5;
    private static readonly _GSAP_EASE_FADE_IN: string = "power2.out";
    private static readonly _GSAP_DURATION_FADE_OUT: number = 0.5;
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

        LoaderManager.OnBeginLoad.add(this._onBeginLoad);
        LoaderManager.OnFinishLoad.add(this._onFinishLoad);
        ViewProxy.GetById<LoaderHTMLView>(ViewId.HTML_LOADER).onLoadingBarGsapAnimationComplete.add(this._onLoadingBarGsapAnimationComplete);
    }

    private readonly _onBeginLoad = (): void => {
        gsap.killTweensOf(this.uniforms.uAlpha);
        this.uniforms.uAlpha.value = 0;
        gsap.to(this.uniforms.uAlpha, {
            value: 1,
            duration: LoaderMaterial._GSAP_DURATION_FADE_IN,
            ease: LoaderMaterial._GSAP_EASE_FADE_IN,
        });
    }

    private readonly _onFinishLoad = (): void => {
        gsap.killTweensOf(this.uniforms.uAlpha);
        this.uniforms.uAlpha.value = 1;
    }

    private readonly _onLoadingBarGsapAnimationComplete = (): void => {
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
