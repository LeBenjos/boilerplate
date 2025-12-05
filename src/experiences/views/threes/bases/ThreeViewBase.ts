import { Object3D } from "three";
import type { ViewId } from "../../../constants/experiences/ViewId";
import MainThree from "../../../engines/threes/MainThree";
import ViewBase from "../../bases/ViewBase";

export default abstract class ThreeViewBase extends ViewBase {
    protected _container: Object3D;

    constructor(id: ViewId) {
        super(id);

        this._container = new Object3D();
    }

    public override _show(): void {
        super._show();
        MainThree.Scene.add(this._container);
    }

    public override _hide(): void {
        super._hide();
        MainThree.Scene.remove(this._container);
    }
}
