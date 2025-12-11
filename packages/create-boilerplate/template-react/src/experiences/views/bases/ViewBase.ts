import type { ViewId } from '../../constants/experiences/ViewId';
import type { ViewType } from '../../constants/experiences/ViewType';

export default class ViewBase {
    private readonly _id: ViewId;
    private readonly _type: ViewType;
    protected _isVisible: boolean = false;

    constructor(id: ViewId, type: ViewType) {
        this._id = id;
        this._type = type;
    }

    protected _show(): void {
        this._isVisible = true;
    }

    protected _hide(): void {
        this._isVisible = false;
    }

    //#region Getters
    //
    public get id(): ViewId {
        return this._id;
    }
    public get type(): ViewType {
        return this._type;
    }
    public get isVisible(): boolean {
        return this._isVisible;
    }
    //
    //#endregion
}
