import type { ViewId } from '../constants/experiences/ViewId';
import type ViewBase from '../views/bases/ViewBase';

type ViewConstructor<T extends ViewBase> = new (id: ViewId) => T;

export default class ViewProxy {
    private static _Views = new Map<ViewId, ViewBase>();

    public static Init(): void {
        //
    }

    public static Add(viewId: ViewId, ViewClass: ViewConstructor<ViewBase>): void {
        if (ViewProxy._Views.has(viewId)) {
            throw new Error(`ViewProxy: View with id "${viewId}" already exists.`);
        }

        ViewProxy._Views.set(viewId, new ViewClass(viewId));
    }

    public static GetById<T extends ViewBase = ViewBase>(viewId: ViewId): T {
        const view = ViewProxy._Views.get(viewId);
        if (!view) throw new Error(`ViewProxy: View with id "${viewId}" not found.`);
        return view as T;
    }

    public static Has(viewId: ViewId): boolean {
        return ViewProxy._Views.has(viewId);
    }
}
