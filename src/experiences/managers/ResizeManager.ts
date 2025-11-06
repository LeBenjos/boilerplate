import { Action } from "../tools/Action";
import TickerManager from "./TickerManager";

export class ResizeManager {
  private static _Width: number = 0;
  private static _Height: number = 0;
  private static _PixelRatio: number = 0;

  public static readonly OnResize = new Action();

  public static Init(): void {
    ResizeManager.Reset();
    ResizeManager.Resize();
    // window.addEventListener(DomEvent.RESIZE, ResizeManager.Resize);
    TickerManager.Add(ResizeManager.Update);
  }

  public static Reset(): void {
    // window.removeEventListener(DomEvent.RESIZE, ResizeManager.Resize);
    TickerManager.Remove(ResizeManager.Update);
  }

  public static Resize = (): void => {
    if (ResizeManager._Width == window.innerWidth && ResizeManager._Height == window.innerHeight) return;

    ResizeManager._Width = window.innerWidth;
    ResizeManager._Height = window.innerHeight;
    ResizeManager._PixelRatio = Math.min(window.devicePixelRatio, 2);

    ResizeManager.OnResize.execute();
  };

  public static Update = (dt: number): void => {
    if (ResizeManager._Width != window.innerWidth || ResizeManager._Height != window.innerHeight) ResizeManager.Resize();
  }

  //#region Getters
  //
  public static get Width(): number { return ResizeManager._Width; }
  public static get Height(): number { return ResizeManager._Height; }
  public static get PixelRatio(): number { return ResizeManager._PixelRatio; }
  //
  //#endregion
}
