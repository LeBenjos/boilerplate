import { DomEvent } from "../constants/doms/DomEvent";

export default class CursorManager {
    private static _X: number = 0;
    private static _Y: number = 0;
    private static _NormalizedX: number = 0;
    private static _NormalizedY: number = 0;

    public static Init(): void {
        window.addEventListener(DomEvent.MOUSE_MOVE, this._onMouseMove);
        window.addEventListener(DomEvent.TOUCH_MOVE, this._onTouchMove);
    }

    private static _onMouseMove = (event: MouseEvent): void => {
        this._X = event.clientX;
        this._Y = event.clientY;
        this._NormalizedX = (this._X / window.innerWidth) * 2 - 1;
        this._NormalizedY = -(this._Y / window.innerHeight) * 2 + 1;
    }

    private static _onTouchMove = (event: TouchEvent): void => {
        this._X = event.touches[0].clientX;
        this._Y = event.touches[0].clientY;
        this._NormalizedX = (this._X / window.innerWidth) * 2 - 1;
        this._NormalizedY = -(this._Y / window.innerHeight) * 2 + 1;
    }

    //#region Getters
    //
    public static get X(): number { return this._X; }
    public static get Y(): number { return this._Y; }
    public static get NormalizedX(): number { return this._NormalizedX; }
    public static get NormalizedY(): number { return this._NormalizedY; }
    //
    //#endregion
}
