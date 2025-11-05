export default class AssetUtils {
    public static GetPath(path: string): string {
        let url = `./assets/${path}`;
        return url;
    }
}