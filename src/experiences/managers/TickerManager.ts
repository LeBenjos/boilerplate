export type Tickable = (dt: number) => void;

export default class TickerManager {
    private static _IsRunning: boolean = false;
    private static readonly _Tickables = new Set<Tickable>();
    private static _StartTime: number = performance.now();
    private static _CurrentTime: number = TickerManager._StartTime;
    private static _ElapsedTime: number;
    private static _DeltaTime: number;

    //#region Constants
    //
    private static readonly _TIME_SCALE: number = 0.001;
    private static readonly _MAX_DELTA: number = 0.1;
    //
    //#endregion

    public static Init(): void {
        TickerManager.Start();
        TickerManager._ElapsedTime = 0;
        TickerManager._DeltaTime = 0.016;
        TickerManager._Update();
    }

    public static Start() {
        TickerManager.Stop();
        TickerManager._IsRunning = true;
        TickerManager._StartTime = performance.now();
        TickerManager._CurrentTime = TickerManager._StartTime;
    }

    public static Stop() {
        TickerManager._IsRunning = false;
    }

    public static Play() {
        TickerManager.Pause();
        TickerManager._IsRunning = true;
        TickerManager._CurrentTime = performance.now();
    }

    public static Pause() {
        TickerManager._IsRunning = false;
    }

    public static Add(tickable: Tickable) {
        TickerManager._Tickables.add(tickable);
    }

    public static Remove(tickable: Tickable) {
        TickerManager._Tickables.delete(tickable);
    }

    private static readonly _Update = (): void => {
        if (TickerManager._IsRunning) {
            const now = performance.now();
            TickerManager._DeltaTime = Math.min((now - TickerManager._CurrentTime) * TickerManager._TIME_SCALE, TickerManager._MAX_DELTA);
            TickerManager._ElapsedTime += TickerManager._DeltaTime;
            TickerManager._CurrentTime = now;

            for (const tickable of TickerManager._Tickables) tickable(TickerManager._DeltaTime);
        }

        requestAnimationFrame(TickerManager._Update);
    }

    //#region Getters
    //
    public static get StartTime(): number { return this._StartTime; }
    public static get CurrentTime(): number { return this._CurrentTime; }
    public static get ElapsedTime(): number { return this._ElapsedTime; }
    public static get DeltaTime(): number { return this._DeltaTime; }
    //
    //#endregion
}
