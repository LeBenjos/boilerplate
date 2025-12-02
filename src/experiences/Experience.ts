import InitCommand from "./commands/InitCommand";
import MainThree from "./engine/threes/MainThree";
import LoaderManager from "./managers/LoaderManager";

export default class Experience {

    public static Init(): void {
        InitCommand.Init();
        MainThree.Init();
        LoaderManager.LoadAllAssets();
    }

}
