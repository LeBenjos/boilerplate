import './styles/style.scss';

import InitCommand from './commands/InitCommand';
import MainThree from './engines/threes/MainThree';
import LoaderManager from './managers/LoaderManager';

export default class Experience {
    public static Init(): void {
        InitCommand.Init();
        MainThree.Init();
        void LoaderManager.LoadAllAssets();
    }
}
