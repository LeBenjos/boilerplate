export type Tickable = (dt: number) => void;

export default class TickerManager {
    private static _IsRunning: boolean = false;
    private static readonly _Tickables: Tickable[] = [];
    private static _StartTime: number = performance.now();
    private static _CurrentTime: number = TickerManager._StartTime;
    private static _ElapsedTime: number = 0;
    private static _DeltaTime: number = 0.016;
    private static readonly _MaxDelta: number = 0.1;

    public static Init(): void {
        TickerManager.Start();
        TickerManager._ElapsedTime = 0;
        TickerManager.Update();
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
        TickerManager._Tickables.push(tickable);
    }

    public static Remove(tickable: Tickable) {
        const index = TickerManager._Tickables.indexOf(tickable);
        if (index !== -1) TickerManager._Tickables.splice(index, 1);
    }

    private static Update = (): void => {
        if (TickerManager._IsRunning) {
            const now = performance.now();
            TickerManager._DeltaTime = Math.min((now - TickerManager._CurrentTime) * 0.001, TickerManager._MaxDelta);
            TickerManager._ElapsedTime += TickerManager._DeltaTime;
            TickerManager._CurrentTime = now;

            for (const tickable of TickerManager._Tickables) tickable(TickerManager._DeltaTime);
        }

        requestAnimationFrame(TickerManager.Update);
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
