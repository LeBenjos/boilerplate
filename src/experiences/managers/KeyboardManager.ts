import { DomEvent } from "../constants/doms/DomEvent";
import Action from "../tools/Action";

export class KeyboardManager {
    private static readonly _KeyDownsMap = new Map<string, boolean>();
    private static readonly _CodeDownsMap = new Map<string, boolean>();

    public static readonly OnKeyDown = new Action<[KeyboardEvent]>();
    public static readonly OnKeyUp = new Action<[KeyboardEvent]>();

    public static Init(): void {
        KeyboardManager._KeyDownsMap.clear();
        KeyboardManager._CodeDownsMap.clear();
        KeyboardManager._AddCallbacks();
    }

    private static _AddCallbacks() {
        KeyboardManager._RemoveCallbacks();
        window.addEventListener(DomEvent.KEY_DOWN, KeyboardManager._OnKeyDown);
        window.addEventListener(DomEvent.KEY_UP, KeyboardManager._OnKeyUp);
    }

    private static _RemoveCallbacks() {
        window.removeEventListener(DomEvent.KEY_DOWN, KeyboardManager._OnKeyDown);
        window.removeEventListener(DomEvent.KEY_UP, KeyboardManager._OnKeyUp);
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

    public static IsKeyDown(name: string): boolean {
        if (!KeyboardManager.IsAvailableForControl()) return false;
        if (KeyboardManager._CodeDownsMap.get(name)) return true;
        if (KeyboardManager._KeyDownsMap.get(name)) return true;
        return false;
    }

    public static IsAnyKeyDown(names: string[]): boolean {
        if (!KeyboardManager.IsAvailableForControl()) return false;
        return names.some(name => KeyboardManager.IsKeyDown(name));
    }

    public static AreAllKeysDown(names: string[]): boolean {
        if (!KeyboardManager.IsAvailableForControl()) return false;
        return names.every(name => KeyboardManager.IsKeyDown(name));
    }

    public static IsAvailableForControl(): boolean {
        const active: HTMLElement = document.activeElement as HTMLElement;
        return !(active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active?.isContentEditable);
    }
}
