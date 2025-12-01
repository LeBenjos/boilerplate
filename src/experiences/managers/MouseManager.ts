import { DomEvent } from "../constants/doms/DomEvent";
import { Action } from "../tools/Action";

export default class MouseManager {
    private static _X: number = 0;
    private static _Y: number = 0;
    private static _NormalizedX: number = 0;
    private static _NormalizedY: number = 0;
    private static _CentralX: number = 0;
    private static _CentralY: number = 0;

    public static readonly OnMouseDown = new Action();
    public static readonly OnMouseUp = new Action();
    public static readonly OnMouseMove = new Action();

    public static Init(): void {
        this._AddCallbacks();
    }

    private static _AddCallbacks(): void {
        this._RemoveCallbacks();
        window.addEventListener(DomEvent.TOUCH_START, this._OnMouseDown);
        window.addEventListener(DomEvent.TOUCH_END, this._OnMouseUp);
        window.addEventListener(DomEvent.TOUCH_MOVE, this._OnMouseMove);
        window.addEventListener(DomEvent.MOUSE_DOWN, this._OnMouseDown);
        window.addEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
        window.addEventListener(DomEvent.MOUSE_MOVE, this._OnMouseMove);
    }

    private static _RemoveCallbacks(): void {
        window.removeEventListener(DomEvent.TOUCH_START, this._OnMouseDown);
        window.removeEventListener(DomEvent.TOUCH_END, this._OnMouseUp);
        window.removeEventListener(DomEvent.TOUCH_MOVE, this._OnMouseMove);
        window.removeEventListener(DomEvent.MOUSE_DOWN, this._OnMouseDown);
        window.removeEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
        window.removeEventListener(DomEvent.MOUSE_MOVE, this._OnMouseMove);
    }

    private static readonly _OnMouseDown = (event: MouseEvent | TouchEvent): void => {
        this._OnMouseMove(event);
        this.OnMouseDown.execute();
    }

    private static readonly _OnMouseUp = (event: MouseEvent | TouchEvent): void => {
        this.OnMouseUp.execute();
    }

    private static readonly _OnMouseMove = (event: MouseEvent | TouchEvent): void => {
        this._UpdateMousePosition(event);
        this.OnMouseMove.execute();
    }

    private static _UpdateMousePosition(event: Event): void {
        const { x, y } = this._GetMousePosition(event);
        this._X = x;
        this._Y = y;
        this._NormalizedX = this._X / window.innerWidth;
        this._NormalizedY = 1 - (this._Y / window.innerHeight);
        this._CentralX = this._NormalizedX * 2 - 1;
        this._CentralY = this._NormalizedY * 2 - 1;
        this.OnMouseMove.execute();
    }

    private static _GetMousePosition(e: Event): { x: number, y: number } {
        if (e instanceof MouseEvent) {
            return { x: e.clientX, y: e.clientY };
        }

        if (window.TouchEvent && e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }

        return { x: 0, y: 0 };
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
