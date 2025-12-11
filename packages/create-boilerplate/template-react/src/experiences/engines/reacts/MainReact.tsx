import { useEffect } from 'react';
import Experience from '../../Experience';
import { useReactViews } from '../../views/reacts/hooks/useReactViews';

function MainReact(): JSX.Element {
    const reactViews = useReactViews();

    useEffect(() => {
        Experience.Init();
    }, []);

    return <>{reactViews}</>;
}

export default MainReact;