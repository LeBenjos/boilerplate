import './styles/style.scss';

import InitCommand from "./commands/InitCommand";
import MainHTML from "./engines/htmls/MainHTML";
import MainThree from "./engines/threes/MainThree";
import LoaderManager from "./managers/LoaderManager";

export default class Experience {

    public static Init(): void {
        InitCommand.Init();
        MainHTML.Init();
        MainThree.Init();
        LoaderManager.LoadAllAssets();
    }

}
