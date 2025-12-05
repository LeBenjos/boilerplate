import { ViewId } from "../../constants/experiences/ViewId";
import ViewProxy from "../../proxies/ViewProxy";
import LoaderHTMLView from "../../views/htmls/loaders/LoaderHTMLView";

export default class MainHTML {
    public static Init(): void {
        MainHTML._GenerateViews();
    }

    private static _GenerateViews(): void {
        ViewProxy.Add(ViewId.HTML_LOADER, LoaderHTMLView);
    }
}