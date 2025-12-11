import type { ViewId } from '../../../constants/experiences/ViewId';
import ReactViewBase, { type ReactViewProps } from '../bases/ReactViewBase';
import LoaderReactComponent from './components/LoaderReactComponent';

export default class LoaderReactView extends ReactViewBase {
    public constructor(id: ViewId) {
        super(id);
    }

    public Component(props: ReactViewProps): JSX.Element {
        return <LoaderReactComponent {...props} />;
    }
}
