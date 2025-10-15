import GUI from "lil-gui";

export default class DebugManager {
    private static _Gui: GUI

    public static Init(): void {
        if (window.location.hash === "#debug") {
            this._Gui = new GUI();
        }
    }

    public static get IsActive(): boolean { return !!this._Gui; }
    public static get Gui(): GUI { return this._Gui; }
}