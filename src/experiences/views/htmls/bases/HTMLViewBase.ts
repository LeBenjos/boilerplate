import type { ViewId } from "../../../constants/experiences/ViewId";
import DomUtils from "../../../Utils/DomUtils";
import ViewBase from "../../bases/ViewBase";

export default abstract class HTMLViewBase extends ViewBase {
    protected declare _htmlContainer: HTMLDivElement;

    constructor(id: ViewId) {
        super(id);
    }

    protected override _show(): void {
        super._show();
        DomUtils.GetApp().appendChild(this._htmlContainer);
    }

    protected override _hide(): void {
        super._hide();
        DomUtils.GetApp().removeChild(this._htmlContainer);
    }
}
