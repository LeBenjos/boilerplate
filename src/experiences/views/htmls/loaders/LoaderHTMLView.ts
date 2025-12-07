import { ViewId } from "../../../constants/experiences/ViewId";
import LoaderManager from "../../../managers/LoaderManager";
import Action from "../../../tools/Action";
import HTMLViewBase from "../bases/HTMLViewBase";
import HTMLTemplateLoader from "./components/HTMLTemplateLoader";

export default class LoaderHTMLView extends HTMLViewBase {
    private declare _HTMLLoader: HTMLTemplateLoader;

    public readonly onLoadingBarGsapAnimationComplete: Action = new Action();

    constructor(id: ViewId) {
        super(id);

        this._generateLoader();

        LoaderManager.OnBeginLoad.add(this._onBeginLoad);
        this._HTMLLoader.onLoadingBarGsapAnimationComplete.add(this._onLoadingBarGsapAnimationComplete);
        this._HTMLLoader.onLoadingProgressGsapAnimationComplete.add(this._onLoadingProgressGsapAnimationComplete);
    }

    private _generateLoader(): void {
        this._HTMLLoader = new HTMLTemplateLoader();
        this._htmlContainer = this._HTMLLoader.htmlElement;
    }

    private readonly _onBeginLoad = (): void => {
        this._show();
    }

    private readonly _onLoadingBarGsapAnimationComplete = (): void => {
        this.onLoadingBarGsapAnimationComplete.execute();
    }

    private readonly _onLoadingProgressGsapAnimationComplete = (): void => {
        this._hide();
    }
}
