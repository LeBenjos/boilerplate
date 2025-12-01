import { Action } from "../tools/Action";
import ThreeAssetsManager from "./threes/ThreeAssetsManager";

export default class LoaderManager {
    private static _LoadingBar: HTMLDivElement = document.querySelector(".loading-bar")!;
    private static _LoadingProgress: HTMLDivElement = document.querySelector(".loading-progress")!;
    private static _LoadingNumber: HTMLSpanElement = LoaderManager._LoadingProgress.querySelector(".loading-number")!;
    private static _TotalSize: number = 0;
    private static _LoadedSize: number = 0;

    public static OnBeginLoad = new Action();
    public static OnFinishLoad = new Action();

    public static Init(): void {
        LoaderManager._AddCallbacks();
    }

    private static _AddCallbacks(): void {
        LoaderManager._RemoveCallbacks();
        ThreeAssetsManager.OnLoad.add(LoaderManager._OnLoad);
        ThreeAssetsManager.OnProgress.add(LoaderManager._OnProgress);

    }

    private static _RemoveCallbacks(): void {
        ThreeAssetsManager.OnLoad.remove(LoaderManager._OnLoad);
        ThreeAssetsManager.OnProgress.remove(LoaderManager._OnProgress);
    }

    public static async LoadAllAssets(): Promise<void> {
        if (LoaderManager._CheckIsFinished()) {
            LoaderManager._OnFinishLoad();
        } else {
            ThreeAssetsManager.LoadAssets();
            LoaderManager.OnBeginLoad.execute();
            LoaderManager._LoadingProgress.style.opacity = "1";
        }
    }

    private static _OnLoad = (): void => {
        LoaderManager._RefreshSizes();

        if (LoaderManager._CheckIsFinished()) {
            LoaderManager._OnFinishLoad();
        }
    }

    private static _CheckIsFinished = (): boolean => {
        if (!ThreeAssetsManager.IsLoaded) return false;
        return true;
    }

    private static _OnProgress = (): void => {
        LoaderManager._RefreshSizes();
        const progress = LoaderManager._LoadedSize / LoaderManager._TotalSize * 100;
        LoaderManager._LoadingBar.style.transform = `translateY(-50%) scaleX(${progress / 100})`;
        LoaderManager._LoadingNumber.textContent = Math.round(progress).toString();
    }

    private static _RefreshSizes = (): void => {
        LoaderManager._RefreshTotalSize();
        LoaderManager._RefreshLoadedSize();
    }

    private static _RefreshTotalSize = (): void => {
        LoaderManager._TotalSize = 0;
        LoaderManager._TotalSize += ThreeAssetsManager.TotalSize;
    }

    private static _RefreshLoadedSize = (): void => {
        LoaderManager._LoadedSize = 0;
        LoaderManager._LoadedSize += ThreeAssetsManager.LoadedSize;
    }

    private static _OnFinishLoad = (): void => {
        LoaderManager._LoadingBar.style.transform = '';
        LoaderManager._LoadingBar.classList.add("ended");
        LoaderManager._LoadingProgress.style.opacity = '';
        LoaderManager._LoadingProgress.classList.add("ended");

        LoaderManager.OnFinishLoad.execute();
    }

    //#region Getters
    //
    public static get IsLoaded(): boolean { return LoaderManager._LoadedSize === LoaderManager._TotalSize && LoaderManager._TotalSize > 0; }
    public static get TotalSize(): number { return LoaderManager._TotalSize; }
    public static get LoadedSize(): number { return LoaderManager._LoadedSize; }
    //
    //#endregion
}