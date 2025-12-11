import { useEffect, useState, type ReactNode } from 'react';
import { ViewType } from '../../../constants/experiences/ViewType';
import ViewProxy from '../../../proxies/ViewProxy';
import ReactViewBase from '../bases/ReactViewBase';

export function useReactViews(): ReactNode[] {
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const views = Array.from(ViewProxy.GetAll());

        const onViewsChanged = () => {
            forceUpdate({});
        }

        for (const view of views) {
            if (view instanceof ReactViewBase) {
                view.setUpdateCallback(onViewsChanged);
            }
        }
    }, []);

    const views = Array.from(ViewProxy.GetAll<ReactViewBase>(ViewType.REACT));
    return views
        .filter((view) => view.isVisible)
        .map((view) => <view.Component key={view.id} viewId={view.id} />);
}
