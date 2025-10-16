import { DomEvent } from "../constants/doms/DomEvent";
import { Action } from "../tools/Action";

export class KeyboardManager {
    private static _KeyDownsMap = new Map<string, boolean>();
    private static _CodeDownsMap = new Map<string, boolean>();

    public static readonly OnKeyDown = new Action<[KeyboardEvent]>();
    public static readonly OnKeyUp = new Action<[KeyboardEvent]>();

    public static Init(): void {
        KeyboardManager._KeyDownsMap.clear();
        KeyboardManager._CodeDownsMap.clear();
        KeyboardManager.Start();
    }

    public static Start(): void {
        KeyboardManager._AddCallbacks();
    }

    public static Stop(): void {
        KeyboardManager._RemoveCallbacks();
    }

    private static readonly _OnBlur = () => {
        KeyboardManager._KeyDownsMap.clear();
        KeyboardManager._CodeDownsMap.clear();
    };

    private static _AddCallbacks() {
        KeyboardManager._RemoveCallbacks();
        window.addEventListener(DomEvent.KEY_DOWN, KeyboardManager._OnKeyDown);
        window.addEventListener(DomEvent.KEY_UP, KeyboardManager._OnKeyUp);
        window.addEventListener(DomEvent.BLUR, KeyboardManager._OnBlur);
        window.addEventListener(DomEvent.CONTEXT_MENU, KeyboardManager._OnContextMenu);

    }

    private static _RemoveCallbacks() {
        window.removeEventListener(DomEvent.KEY_DOWN, KeyboardManager._OnKeyDown);
        window.removeEventListener(DomEvent.KEY_UP, KeyboardManager._OnKeyUp);
        window.removeEventListener(DomEvent.BLUR, KeyboardManager._OnBlur);
        window.removeEventListener(DomEvent.CONTEXT_MENU, KeyboardManager._OnContextMenu);
    }

    private static readonly _OnKeyDown = (e: KeyboardEvent): void => {
        KeyboardManager._KeyDownsMap.set(e.key, true);
        KeyboardManager._CodeDownsMap.set(e.code, true);
        KeyboardManager.OnKeyDown.execute(e);
    };

    private static readonly _OnKeyUp = (e: KeyboardEvent): void => {
        KeyboardManager.OnKeyUp.execute(e);
        KeyboardManager._KeyDownsMap.set(e.key, false);
        KeyboardManager._CodeDownsMap.set(e.code, false);
    };

    private static readonly _OnContextMenu = () => {
        KeyboardManager._KeyDownsMap.clear();
        KeyboardManager._CodeDownsMap.clear();
    };

    public static IsDown(name: string): boolean {
        if (KeyboardManager._KeyDownsMap.get(name)) return true;
        if (KeyboardManager._CodeDownsMap.get(name)) return true;
        return false;
    }

    public static IsDowns(names: string[]): boolean {
        for (let name of names) {
            if (KeyboardManager.IsDown(name)) return true;
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
