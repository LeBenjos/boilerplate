import { useEffect } from 'react';
import Experience from '../../Experience';

function MainReact(): JSX.Element {
    useEffect(() => {
        Experience.Init();
    }, []);
    return <></>;
}

export default MainReact;