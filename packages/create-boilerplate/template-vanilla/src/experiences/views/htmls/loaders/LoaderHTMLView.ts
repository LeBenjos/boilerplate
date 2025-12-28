import { DomUtils } from '@benjos/cookware';
import { ViewId } from '../../../constants/experiences/ViewId';
import LoaderManager from '../../../managers/LoaderManager';
import HTMLViewBase from '../bases/HTMLViewBase';
import HTMLTemplateLoader from './components/HTMLTemplateLoader';

export default class LoaderHTMLView extends HTMLViewBase {
    declare private _htmlLoader: HTMLTemplateLoader;

    constructor(id: ViewId) {
        super(id, DomUtils.getLoader());

        this._generateLoader();

        LoaderManager.OnBeginLoad.add(this._onBeginLoad);
        LoaderManager.OnFinishLoad.add(this._onFinishLoad);
    }

    private _generateLoader(): void {
        this._htmlLoader = new HTMLTemplateLoader();
        this._htmlContainer.appendChild(this._htmlLoader.htmlElement);
        DomUtils.getLoader().appendChild(this._htmlContainer);
    }

    private readonly _onBeginLoad = (): void => {
        this._show();
        this._htmlLoader.show();
    };

    private readonly _onFinishLoad = (): void => {
        this._htmlLoader.hide();
        this._hide();
    };
}
