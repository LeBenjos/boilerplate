import { ViewId } from "../../../constants/experiences/ViewId";
import LoaderManager from "../../../managers/LoaderManager";
import HTMLViewBase from "../bases/HTMLViewBase";
import HTMLTemplateLoader from "./components/HTMLTemplateLoader";

export default class LoaderHTMLView extends HTMLViewBase {
    private declare _HTMLLoader: HTMLTemplateLoader;

    constructor(id: ViewId) {
        super(id);

        this._generateLoader();

        LoaderManager.OnBeginLoad.add(this._onBeginLoad);
        this._HTMLLoader.onLoadingBarTransitionEnd.add(this._onLoadingBarTransitionEnd);
    }

    private _generateLoader(): void {
        this._HTMLLoader = new HTMLTemplateLoader();
        this._htmlContainer = this._HTMLLoader.htmlElement;
    }

    private readonly _onBeginLoad = (): void => {
        this._show();
    }

    private readonly _onLoadingBarTransitionEnd = (): void => {
        this._hide();
    }
}
