import { DomEvent } from "../constants/doms/DomEvent";

export default class CursorManager {
    private static _X: number = 0;
    private static _Y: number = 0;
    private static _NormalizedX: number = 0;
    private static _NormalizedY: number = 0;
    private static _CentralX: number = 0;
    private static _CentralY: number = 0;

    public static Init(): void {
        window.addEventListener(DomEvent.MOUSE_MOVE, this._onMouseMove);
        window.addEventListener(DomEvent.TOUCH_MOVE, this._onTouchMove);
    }

    private static _onMouseMove = (event: MouseEvent): void => {
        this._X = event.clientX;
        this._Y = event.clientY;
        this._NormalizedX = this._X / window.innerWidth;
        this._NormalizedY = 1 - (this._Y / window.innerHeight);
        this._CentralX = this._NormalizedX * 2 - 1;
        this._CentralY = this._NormalizedY * 2 - 1;
    }

    private static _onTouchMove = (event: TouchEvent): void => {
        this._X = event.touches[0].clientX;
        this._Y = event.touches[0].clientY;
        this._NormalizedX = this._X / window.innerWidth;
        this._NormalizedY = 1 - (this._Y / window.innerHeight);
        this._CentralX = this._NormalizedX * 2 - 1;
        this._CentralY = this._NormalizedY * 2 - 1;
    }

    //#region Getters
    //
    public static get X(): number { return this._X; }
    public static get Y(): number { return this._Y; }
    public static get NormalizedX(): number { return this._NormalizedX; }
    public static get NormalizedY(): number { return this._NormalizedY; }
    public static get CentralX(): number { return this._CentralX; }
    public static get CentralY(): number { return this._CentralY; }
    //
    //#endregion
}
