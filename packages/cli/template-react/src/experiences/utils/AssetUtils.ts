export default class AssetUtils {
    public static GetPath(path: string): string {
        path = path.trim();
        return `./assets/${path}`;
    }
}
