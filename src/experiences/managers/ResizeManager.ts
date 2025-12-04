import Action from "../tools/Action";
import TickerManager from "./TickerManager";

export class ResizeManager {
  private static _Width: number;
  private static _Height: number;
  private static _PixelRatio: number;

  public static readonly OnResize = new Action();

  //#region Constants
  //
  private static readonly _MAX_PIXEL_RATIO: number = 2;
  //
  //#endregion

  public static Init(): void {
    ResizeManager.Reset();
    ResizeManager._Resize();
    TickerManager.Add(ResizeManager.Update);
  }

  public static Reset(): void {
    TickerManager.Remove(ResizeManager.Update);
  }

  private static readonly _Resize = (): void => {
    ResizeManager._Width = window.innerWidth;
    ResizeManager._Height = window.innerHeight;
    ResizeManager._PixelRatio = Math.min(window.devicePixelRatio, ResizeManager._MAX_PIXEL_RATIO);

    ResizeManager.OnResize.execute();
  };

  public static readonly Update = (dt: number): void => {
    if (ResizeManager._Width !== window.innerWidth || ResizeManager._Height !== window.innerHeight) ResizeManager._Resize();
  }

  //#region Getters
  //
  public static get Width(): number { return ResizeManager._Width; }
  public static get Height(): number { return ResizeManager._Height; }
  public static get PixelRatio(): number { return ResizeManager._PixelRatio; }
  //
  //#endregion
}
