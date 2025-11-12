import GUI from "lil-gui";
import { ThreePerf } from 'three-perf';
import { KeyboardConstant } from "../constants/doms/KeyboardConstant";
import Experience from "../Experience";
import { KeyboardManager } from "./KeyboardManager";

export default class DebugManager {
    private static _Gui: GUI
    private static _ThreePerf: ThreePerf;

    public static Init(): void {
        if (DebugManager.IsActive) {
            DebugManager._Gui = new GUI({
                width: 300,
                title: "Debug Panel",
                closeFolders: true
            });
            DebugManager._Gui.close();
            KeyboardManager.OnKeyUp.add(DebugManager._OnKeyUp);
        }
    }

    private static _InitThreePerf = (): void => {
        DebugManager._ThreePerf = new ThreePerf({
            anchorX: 'left',
            anchorY: 'bottom',
            domElement: document.body,
            renderer: Experience.Renderer,
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
        if (KeyboardManager.AreAllKeysDown([KeyboardConstant.Codes.ShiftLeft, KeyboardConstant.Codes.KeyH])) {
            DebugManager._Gui.show(DebugManager._Gui._hidden);
            DebugManager._ThreePerf.visible = !DebugManager._ThreePerf.visible;
        }
    };

    //#region Getters
    //
    public static get IsActive(): boolean { return window.location.hash === "#debug"; }
    public static get Gui(): GUI { return DebugManager._Gui; }
    //
    //#endregion
}
