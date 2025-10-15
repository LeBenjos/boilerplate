export class PoolObject<T> {
    private _availablesList = new Array<T>();
    private _constructor: new () => T;

    public get availablesList(): Array<T> {
        return this._availablesList;
    }

    private static _Lock: boolean = false;
    public static Create<T>(creator: new () => T): PoolObject<T> {
        PoolObject._Lock = true;
        const pool = new PoolObject<T>(creator);
        PoolObject._Lock = false;
        return pool;
    }

    constructor(creator: new () => T) {
        if (!PoolObject._Lock) throw new Error('do not use new PoolObject, use PoolObject.Create(Class) instead');
        this._constructor = creator;
    }

    public get(): T {
        let o: T;
        if (this._availablesList.length) {
            o = this._availablesList.pop() as T;
        } else {
            o = new this._constructor() as T;
        }
        return o as T;
    }

    public release(o: T): void {
        if (!this._availablesList.includes(o)) {
            this._availablesList.push(o);
        }
    }

    public get creator(): new () => T {
        return this._constructor;
    }
}
