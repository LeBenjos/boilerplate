import { useEffect, useState } from 'react';
import LoaderManager from '../../../../managers/LoaderManager';
import type { ReactViewProps } from '../../bases/ReactViewBase';
import './LoaderReactComponent.scss';

export default function LoaderReactComponent({ viewId }: ReactViewProps): JSX.Element {
    const [progress, setProgress] = useState(0);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const loaderManager = LoaderManager.Instance;

        const updateProgress = (): void => {
            const currentProgress = loaderManager.Progress;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                setIsEnded(true);
            }
        };

        // Update progress on each tick
        const interval = setInterval(updateProgress, 16); // ~60fps

        return () => clearInterval(interval);
    }, []);

    return (
        <div id="loading-screen" className="loading-screen">
            <div className="loading-progress">
                <span className="loading-number">{Math.floor(progress)}</span>
                <span>%</span>
            </div>
            <div className={`loading-bar ${isEnded ? 'ended' : ''}`}></div>
        </div>
    );
}
