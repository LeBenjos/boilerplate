import gsap from "gsap";
import LoaderManager from "../../../../managers/LoaderManager";
import Action from "../../../../tools/Action";

export default class HTMLTemplateLoader {
    private declare _htmlElement: HTMLDivElement;
    private declare _loadingBar: HTMLDivElement;
    private declare _loadingProgress: HTMLDivElement;
    private declare _loadingNumber: HTMLSpanElement;

    public readonly onLoadingBarGsapAnimationComplete: Action = new Action();
    public readonly onLoadingProgressGsapAnimationComplete: Action = new Action();

    //#region Constants
    //
    private static readonly _GSAP_DURATION_FADE_IN: number = 0.5;
    private static readonly _GSAP_EASE_FADE_IN: string = "power2.out";
    private static readonly _GSAP_DURATION_LOADING_BAR_FADE_OUT: number = 1;
    private static readonly _GSAP_DURATION_FADE_OUT: number = 0.5;
    private static readonly _GSAP_EASE_FADE_OUT: string = "power2.in";
    //
    //#endregion

    constructor() {
        this._generateElement();

        LoaderManager.OnBeginLoad.add(this._onBeginLoad);
        LoaderManager.OnProgress.add(this._onProgress);
        LoaderManager.OnFinishLoad.add(this._onFinishLoad);
    }

    private _generateElement(): void {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <div id="loading-screen" class="loading-screen">
                <div class="loading-progress">
                    <span class="loading-number">0</span><span>%</span>
                </div>
                <div class="loading-bar"></div>
            </div>
        `.trim();

        this._htmlElement = wrapper.querySelector("#loading-screen")!;
        this._loadingProgress = this._htmlElement.querySelector(".loading-progress")!;
        this._loadingNumber = this._loadingProgress.querySelector(".loading-number")!;
        this._loadingBar = this._htmlElement.querySelector(".loading-bar")!;
    }

    private _onBeginLoad = (): void => {
        this._loadingNumber.textContent = Math.round(0).toString();
        this._loadingBar.classList.remove("ended");
        this._loadingBar.style.transform = "translateY(-50%) scaleX(0)";
        this._loadingNumber.textContent = "0";
        this._loadingProgress.style.opacity = "0";

        const progressObj = { value: 0 };
        gsap.to(progressObj, {
            value: 1,
            duration: HTMLTemplateLoader._GSAP_DURATION_FADE_IN,
            ease: HTMLTemplateLoader._GSAP_EASE_FADE_IN,
            onUpdate: () => {
                this._loadingProgress.style.opacity = `${progressObj.value}`;
            }
        });
    }

    private _onProgress = (): void => {
        const progress = LoaderManager.LoadedSize / LoaderManager.TotalSize * 100;
        this._loadingBar.style.transform = `translateY(-50%) scaleX(${progress / 100})`;
        this._loadingNumber.textContent = Math.round(progress).toString();
    }

    private _onFinishLoad = (): void => {
        this._loadingBar.classList.add("ended");
        this._loadingBar.style.transform = "translateY(-50%) scaleX(1)";

        const progressObj = { value: 1 };
        gsap.to(progressObj, {
            value: 0,
            duration: HTMLTemplateLoader._GSAP_DURATION_LOADING_BAR_FADE_OUT,
            ease: HTMLTemplateLoader._GSAP_EASE_FADE_OUT,
            onUpdate: () => {
                this._loadingBar.style.transform = `translateY(-50%) scaleX(${progressObj.value})`;
            },
            onComplete: this._onLoadingBarGsapAnimationEndComplete,
        });
    }

    private _onLoadingBarGsapAnimationEndComplete = (): void => {
        this._loadingProgress.style.opacity = "1";
        this._loadingNumber.textContent = "100";

        const progressObj = { value: 1 };
        gsap.to(progressObj, {
            value: 0,
            duration: HTMLTemplateLoader._GSAP_DURATION_FADE_OUT,
            ease: HTMLTemplateLoader._GSAP_EASE_FADE_OUT,
            onUpdate: () => {
                this._loadingProgress.style.opacity = `${progressObj.value}`;
            },
            onComplete: this._onLoadingProgressGsapAnimationComplete,
        });
        this.onLoadingBarGsapAnimationComplete.execute();
    }

    private readonly _onLoadingProgressGsapAnimationComplete = (): void => {
        this.onLoadingProgressGsapAnimationComplete.execute();
    }

    //#region 
    //
    public get htmlElement(): HTMLDivElement { return this._htmlElement; }
    //
    //#endregion
}
