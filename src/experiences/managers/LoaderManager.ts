import { DomEvent } from "../constants/doms/DomEvent";
import { Action } from "../tools/Action";
import ThreeAssetsManager from "./ThreeAssetsManager";

export default class LoaderManager {
    private static _LoadingBar: HTMLDivElement = document.querySelector(".loading-bar")!;
    private static _TotalAssetsToLoad: number = 0;
    private static _AssetsLoaded: number = 0;

    public static OnFinishLoad = new Action();

    public static Init(): void {
        ThreeAssetsManager.OnLoad.add(LoaderManager._onLoad);
    }

    public static LoadAllAssets(): void {
        LoaderManager._TotalAssetsToLoad += ThreeAssetsManager.ToLoadCount;
        ThreeAssetsManager.LoadAssets();
    }

    private static _onLoad = (): void => {
        LoaderManager._AssetsLoaded++;

        const progress = LoaderManager._AssetsLoaded / LoaderManager._TotalAssetsToLoad * 100;
        LoaderManager._LoadingBar.style.transform = `translateY(-50%) scaleX(${progress / 100})`;

        LoaderManager._OnFinishLoad();
    }

    private static _OnFinishLoad(): void {
        if (LoaderManager._AssetsLoaded === LoaderManager._TotalAssetsToLoad) {
            LoaderManager.OnFinishLoad.execute();
            LoaderManager._LoadingBar.addEventListener(DomEvent.TRANSITION_END, LoaderManager._OnBarTransitionEnd);
        }
    }

    private static _OnBarTransitionEnd = (): void => {
        LoaderManager._LoadingBar.classList.add("ended");
        LoaderManager._LoadingBar.style.transform = '';
        LoaderManager._LoadingBar.removeEventListener(DomEvent.TRANSITION_END, LoaderManager._OnBarTransitionEnd);
    }

    //#region Getters
    //
    public static get IsLoaded(): boolean { return LoaderManager._AssetsLoaded === LoaderManager._TotalAssetsToLoad && LoaderManager._TotalAssetsToLoad > 0; }
    public static get ToLoadCount(): number { return LoaderManager._TotalAssetsToLoad; }
    public static get LoadedCount(): number { return LoaderManager._AssetsLoaded; }
    //
    //#endregion
}