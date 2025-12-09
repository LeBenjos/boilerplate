import type { ViewId } from '../../constants/experiences/ViewId';

export default class ViewBase {
    private readonly _id: ViewId;

    constructor(id: ViewId) {
        this._id = id;
    }

    protected _show(): void {
        //
    }

    protected _hide(): void {
        //
    }

    //#region Getters
    //
    public get id(): ViewId {
        return this._id;
    }
    //
    //#endregion
}
