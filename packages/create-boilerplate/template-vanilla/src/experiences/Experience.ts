import './styles/style.scss';

import InitCommand from './commands/InitCommand';
import MainHTML from './engines/htmls/MainHTML';
import MainThree from './engines/threes/MainThree';
import LoaderManager from './managers/LoaderManager';

export default class Experience {
    private static _isInitialized = false;

    public static Init(): void {
        if (Experience._isInitialized) {
            return;
        }
        Experience._isInitialized = true;

        InitCommand.Init();
        MainHTML.Init();
        MainThree.Init();
        void LoaderManager.LoadAllAssets();
    }
}
