import gsap from "gsap";
import { Color, ShaderMaterial } from "three";
import LoaderManager from "../../managers/LoaderManager";
import LoaderFragmentShader from "../../shaders/loaders/LoaderFragmentShader.glsl";
import LoaderVertexShader from "../../shaders/loaders/LoaderVertexShader.glsl";

export default class LoaderMaterial extends ShaderMaterial {
    constructor() {
        super({
            transparent: true,
            uniforms: {
                uAlpha: { value: 1.0 },
                uColor: { value: new Color(0x3F79F3) },
            },
            vertexShader: LoaderVertexShader,
            fragmentShader: LoaderFragmentShader
        });

        LoaderManager.OnFinishLoad.add(this._onFinishLoad);
    }

    private _onFinishLoad = (): void => {
        gsap.to(this.uniforms.uAlpha, {
            value: 0.0,
            duration: 1.5,
            ease: "power2.in"
        });
    }
}