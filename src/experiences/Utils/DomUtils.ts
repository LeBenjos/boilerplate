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

    public static GetLoader(): HTMLDivElement {
        const loader = document.querySelector("#loader") as HTMLDivElement;

        if (!loader) {
            const app = DomUtils.GetApp();
            const newLoader = document.createElement("div");
            newLoader.id = "loader";
            app.appendChild(newLoader);
            return newLoader;
        }

        return loader;
    }
}
