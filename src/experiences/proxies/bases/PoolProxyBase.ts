type Constructor<T> = new () => T;

export default abstract class PoolProxyBase<T = unknown> {
    protected readonly _pool: Set<T> = new Set<T>();
    private readonly _ctor: Constructor<T>;

    constructor(ctor: Constructor<T>) {
        this._ctor = ctor;
    }

    public get(): T {
        if (this._pool.size > 0) {
            const o = this._pool.values().next().value!;
            this._pool.delete(o);
            return o;
        }

        return new this._ctor();
    }

    public release(o: T): void {
        this._pool.add(o);
    }
}

//#region TEMPLATE USAGE
//
// class TemplatePoolProxy extends PoolProxyBase<TemplateObject> {
//     constructor() {
//         super(TemplateObject);
//     }

//     public override get(): TemplateObject {
//         const o = super.get();
//         // Do any additional initialization here if necessary
//         return o;
//     }

//     public override release(o: TemplateObject): void {
//         // Do any additional cleanup here if necessary
//         super.release(o);
//     }
// }

// const instance = new TemplatePoolProxy();
// export { instance as TemplatePoolProxy };
//
//#endregion