import { DomEvent } from "../constants/doms/DomEvent";
import { Action } from "../tools/Action";

export class KeyboardManager {
    private static _KeyDownsMap = new Map<string, boolean>();
    private static _CodeDownsMap = new Map<string, boolean>();

    public static readonly OnKeyDown = new Action<[KeyboardEvent]>();
    public static readonly OnKeyUp = new Action<[KeyboardEvent]>();

    public static Init(): void {
        this._KeyDownsMap.clear();
        this._CodeDownsMap.clear();
    }

    public static Start(): void {
        this._AddCallbacks();
    }

    public static Stop(): void {
        this._RemoveCallbacks();
    }

    private static readonly _OnBlur = () => {
        this._KeyDownsMap.clear();
        this._CodeDownsMap.clear();
    };

    private static _AddCallbacks() {
        this._RemoveCallbacks();
        window.addEventListener(DomEvent.KEY_DOWN, this._OnKeyDown);
        window.addEventListener(DomEvent.KEY_UP, this._OnKeyUp);
        window.addEventListener(DomEvent.BLUR, this._OnBlur);
        window.addEventListener(DomEvent.CONTEXT_MENU, this._OnContextMenu);

    }

    private static _RemoveCallbacks() {
        window.removeEventListener(DomEvent.KEY_DOWN, this._OnKeyDown);
        window.removeEventListener(DomEvent.KEY_UP, this._OnKeyUp);
        window.removeEventListener(DomEvent.BLUR, this._OnBlur);
        window.removeEventListener(DomEvent.CONTEXT_MENU, this._OnContextMenu);
    }

    private static readonly _OnKeyDown = (e: KeyboardEvent): void => {
        this._KeyDownsMap.set(e.key, true);
        this._CodeDownsMap.set(e.code, true);
        this.OnKeyDown.execute(e);
    };

    private static readonly _OnKeyUp = (e: KeyboardEvent): void => {
        this.OnKeyUp.execute(e);
        this._KeyDownsMap.set(e.key, false);
        this._CodeDownsMap.set(e.code, false);
    };

    private static readonly _OnContextMenu = () => {
        this._KeyDownsMap.clear();
        this._CodeDownsMap.clear();
    };

    public static IsDown(name: string): boolean {
        if (this._KeyDownsMap.get(name)) return true;
        if (this._CodeDownsMap.get(name)) return true;
        return false;
    }

    public static IsDowns(names: string[]): boolean {
        for (let name of names) {
            if (this.IsDown(name)) return true;
        }
        return false;
    }

    public static GetReadableCode(key: string): string {
        key = key.replace('Key', '');
        key = key.replace('Digit', '');
        key = key.replace('Numpad', '');
        key = key.replace('Arrow', '');
        return key;
    }

    public static IsAvailableForControl(): boolean {
        if (document.activeElement instanceof HTMLInputElement) return false;
        return true;
    }
}
