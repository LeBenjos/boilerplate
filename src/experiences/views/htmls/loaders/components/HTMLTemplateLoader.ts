import { DomEvent } from "../../../../constants/doms/DomEvent";
import LoaderManager from "../../../../managers/LoaderManager";
import Action from "../../../../tools/Action";

export default class HTMLTemplateLoader {
    private declare _htmlElement: HTMLDivElement;
    private declare _loadingBar: HTMLDivElement;
    private declare _loadingProgress: HTMLDivElement;
    private declare _loadingNumber: HTMLSpanElement;

    public onLoadingBarTransitionEnd: Action = new Action();

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

        this._loadingBar.addEventListener(DomEvent.TRANSITION_END, this._onLoadingBarTransitionEnd);
    }

    private _onBeginLoad = (): void => {
        this._loadingProgress.classList.remove("ended");
        this._loadingNumber.textContent = Math.round(0).toString();
        this._loadingBar.classList.remove("ended");
        this._loadingBar.style.transform = "translateY(-50%) scaleX(0)";
    }

    private _onProgress = (): void => {
        const progress = LoaderManager.LoadedSize / LoaderManager.TotalSize * 100;
        this._loadingBar.style.transform = `translateY(-50%) scaleX(${progress / 100})`;
        this._loadingNumber.textContent = Math.round(progress).toString();
    }

    private _onFinishLoad = (): void => {
        this._loadingBar.style.transform = '';
        this._loadingBar.classList.add("ended");
        this._loadingProgress.classList.add("ended");
    }

    private readonly _onLoadingBarTransitionEnd = (): void => {
        this.onLoadingBarTransitionEnd.execute();
    }

    //#region 
    //
    public get htmlElement(): HTMLDivElement { return this._htmlElement; }
    //
    //#endregion
}
