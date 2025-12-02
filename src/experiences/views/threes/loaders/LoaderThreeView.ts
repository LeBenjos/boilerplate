import { Object3D } from "three";
import MainThree from "../../../engine/threes/MainThree";
import TemplateLoader from "./components/TemplateLoader";

export default class LoaderThreeView extends Object3D {
    private declare _loader: TemplateLoader;

    constructor() {
        super();

        this._generateLoader();

        MainThree.Scene.add(this._loader);
    }

    private _generateLoader(): void {
        this._loader = new TemplateLoader();
        this.add(this._loader);
    }
}
