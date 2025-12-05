import { ViewId } from "../../../constants/experiences/ViewId";
import LoaderManager from "../../../managers/LoaderManager";
import ThreeViewBase from "../bases/ThreeViewBase";
import ThreeTemplateLoader from "./components/ThreeTemplateLoader";

export default class LoaderThreeView extends ThreeViewBase {
    private declare _threeLoader: ThreeTemplateLoader;

    constructor(id: ViewId) {
        super(id);

        this._generateLoader();

        LoaderManager.OnBeginLoad.add(this._onBeginLoad);
        this._threeLoader.material.onGsapAnimationComplete.add(this._onGsapAnimationComplete);
    }

    private readonly _onBeginLoad = (): void => {
        this._show();
    }

    private readonly _onGsapAnimationComplete = (): void => {
        this._hide();
    }

    private _generateLoader(): void {
        this._threeLoader = new ThreeTemplateLoader();
        this._container.add(this._threeLoader);
    }
}
