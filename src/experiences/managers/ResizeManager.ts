import { Action } from "../tools/Action";
import Ticker from "../tools/Ticker";

export class ResizeManager {
  private static _Width: number = 0;
  private static _Height: number = 0;
  private static _PixelRatio: number = 0;

  public static readonly OnResize = new Action();

  public static Init(): void {
    this.Reset();
    this.Resize();
    // window.addEventListener(DomEvent.RESIZE, this.Resize);
    Ticker.Add(this);
  }

  public static Reset(): void {
    // window.removeEventListener(DomEvent.RESIZE, this.Resize);
    Ticker.Remove(this);
  }

  public static Resize = (): void => {
    if (this._Width == window.innerWidth && this._Height == window.innerHeight) return;

    this._Width = window.innerWidth;
    this._Height = window.innerHeight;
    this._PixelRatio = Math.min(window.devicePixelRatio, 2);

    this.OnResize.execute();
  };

  public static update(): void {
    if (this._Width != window.innerWidth || this._Height != window.innerHeight) this.Resize();
  }

  //#region Getters
  //
  public static get Width(): number { return this._Width; }
  public static get Height(): number { return this._Height; }
  public static get PixelRatio(): number { return this._PixelRatio; }
  //
  //#endregion
}
