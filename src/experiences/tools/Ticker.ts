export interface ITickable {
    update(dt: number): void;
}

export default class Ticker {
    private static _IsRunning: boolean = false;
    private static readonly _Tickables: ITickable[] = [];
    private static _StartTime: number = Date.now();
    private static _CurrentTime: number = Ticker._StartTime;
    private static _ElapsedTime: number = 0;
    private static _DeltaTime: number = 16;

    public static Init(): void {
        Ticker._IsRunning = true;
        Ticker._StartTime = Date.now();
        Ticker._CurrentTime = Ticker._StartTime;
        Ticker._ElapsedTime = 0;
        Ticker.Update();
    }

    public static Start() {
        Ticker.Stop();
        Ticker._IsRunning = true;
        Ticker._StartTime = Date.now();
        Ticker._CurrentTime = Ticker._StartTime;
    }

    public static Stop() {
        Ticker._IsRunning = false;
    }

    public static Play() {
        Ticker.Pause();
        Ticker._IsRunning = true;
        Ticker._CurrentTime = Ticker._StartTime;
    }

    public static Pause() {
        Ticker._IsRunning = false;
    }

    public static Add(tickable: ITickable): void {
        Ticker._Tickables.push(tickable);
    }

    public static Remove(tickable: ITickable): void {
        const index = Ticker._Tickables.indexOf(tickable);
        if (index !== -1) Ticker._Tickables.splice(index, 1);
    }

    private static Update = (): void => {
        if (Ticker._IsRunning) {
            const now = Date.now();
            Ticker._DeltaTime = (now - Ticker._CurrentTime) * 0.001;
            Ticker._ElapsedTime += Ticker._DeltaTime;
            Ticker._CurrentTime = now;

            for (const tickable of Ticker._Tickables) tickable.update(Ticker._DeltaTime);
        }

        requestAnimationFrame(Ticker.Update);
    }


    //#region Getters
    //
    public static get StartTime(): number { return this._StartTime; }
    public static get CurrentTime(): number { return this._CurrentTime; }
    public static get ElapsedTime(): number { return this._ElapsedTime; }
    //
    //#endregion
}
