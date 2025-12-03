import GUI from "lil-gui";
import { ThreePerf } from 'three-perf';
import { KeyboardConstant } from "../constants/doms/KeyboardConstant";
import MainThree from "../engines/threes/MainThree";
import { KeyboardManager } from "./KeyboardManager";

export default class DebugManager {
    private static _Gui: GUI
    private static _ThreePerf: ThreePerf;

    //#region Constants
    //
    private static readonly _IS_ACTIVE_STRING: string = "#debug";
    private static readonly _GUI_WIDTH: number = 300;
    private static readonly _GUI_TITLE: string = "Debug Panel";
    private static readonly _THREE_PERF_ANCHOR_X: 'left' | 'right' = 'left';
    private static readonly _THREE_PERF_ANCHOR_Y: 'top' | 'bottom' = 'bottom';
    private static readonly _TOGGLE_HIDDEN_KEYS: string[] = [KeyboardConstant.Codes.ShiftLeft, KeyboardConstant.Codes.KeyH];
    //
    //#endregion

    public static Init(): void {
        if (DebugManager.IsActive) {
            DebugManager._InitGui();
        }
    }

    private static _InitGui(): void {
        DebugManager._Gui = new GUI({
            width: DebugManager._GUI_WIDTH,
            title: DebugManager._GUI_TITLE,
            closeFolders: true
        });
        DebugManager._Gui.close();
        KeyboardManager.OnKeyUp.remove(DebugManager._OnKeyUp);
        KeyboardManager.OnKeyUp.add(DebugManager._OnKeyUp);
    }

    private static _InitThreePerf = (): void => {
        DebugManager._ThreePerf = new ThreePerf({
            anchorX: DebugManager._THREE_PERF_ANCHOR_X,
            anchorY: DebugManager._THREE_PERF_ANCHOR_Y,
            domElement: document.body,
            renderer: MainThree.Renderer,
            showGraph: false,
        });
    }

    public static BeginThreePerf(): void {
        if (!DebugManager._ThreePerf) DebugManager._InitThreePerf();
        DebugManager._ThreePerf.begin();
    }

    public static EndThreePerf(): void {
        DebugManager._ThreePerf.end();
    }

    private static readonly _OnKeyUp = (e: KeyboardEvent): void => {
        if (KeyboardManager.AreAllKeysDown(DebugManager._TOGGLE_HIDDEN_KEYS)) {
            DebugManager._Gui.show(DebugManager._Gui._hidden);
            DebugManager._ThreePerf.visible = !DebugManager._ThreePerf.visible;
        }
    };

    //#region Getters
    //
    public static get IsActive(): boolean { return window.location.hash === DebugManager._IS_ACTIVE_STRING; }
    public static get Gui(): GUI { return DebugManager._Gui; }
    //
    //#endregion
}
