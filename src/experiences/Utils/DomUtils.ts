export default class DomUtils {
    public static GetApp(): HTMLDivElement {
        const app = (document.querySelector("#app") || document.querySelector("#root")) as HTMLDivElement;

        if (!app) {
            const newApp = document.createElement("div");
            newApp.id = "app";
            document.body.appendChild(newApp);
            return newApp;
        }

        return app;
    }
}
