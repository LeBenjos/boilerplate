import Action from "../tools/Action";
import ThreeAssetsManager from "./threes/ThreeAssetsManager";

export default class LoaderManager {
    private static _TotalSize: number = 0;
    private static _LoadedSize: number = 0;

    public static readonly OnBeginLoad = new Action();
    public static readonly OnProgress = new Action();
    public static readonly OnFinishLoad = new Action();

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
            LoaderManager.OnBeginLoad.execute();
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
        LoaderManager.OnProgress.execute();
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