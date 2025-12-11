import type { ReactNode } from 'react';
import type { ViewId } from '../../../constants/experiences/ViewId';
import { ViewType } from '../../../constants/experiences/ViewType';
import ViewBase from '../../bases/ViewBase';

export type ReactViewProps = {
    viewId: ViewId;
};

export default abstract class ReactViewBase extends ViewBase {
    private _updateCallback?: () => void;

    public constructor(id: ViewId) {
        super(id, ViewType.REACT);
    }

    public abstract Component(props: ReactViewProps): ReactNode;

    public get isVisible(): boolean {
        return this._isVisible;
    }

    public setUpdateCallback(callback: () => void): void {
        this._updateCallback = callback;
    }

    public Show(): void {
        if (!this._isVisible) {
            this._isVisible = true;
            this._updateCallback?.();
        }
    }

    public Hide(): void {
        if (this._isVisible) {
            this._isVisible = false;
            this._updateCallback?.();
        }
    }
}
