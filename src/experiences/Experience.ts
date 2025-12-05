import InitCommand from "./commands/InitCommand";
import MainHTML from "./engines/htmls/MainHTML";
import MainThree from "./engines/threes/MainThree";
import LoaderManager from "./managers/LoaderManager";

export default class Experience {

    public static Init(): void {
        InitCommand.Init();
        MainThree.Init();
        MainHTML.Init();
        LoaderManager.LoadAllAssets();

        setTimeout(() => {
            console.log("Forcing load finish...");
            LoaderManager.LoadAllAssets();
        }, 5000);
    }

}
