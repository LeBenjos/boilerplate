export default class DomUtils {
    public static GetApp(): HTMLDivElement {
        const app = (document.querySelector('#app') ?? document.querySelector('#root'))!;

        if (!app) {
            const newApp = document.createElement('div');
            newApp.id = 'app';
            document.body.appendChild(newApp);
            return newApp;
        }

        return app as HTMLDivElement;
    }

    public static GetLoader(): HTMLDivElement {
        const loader = document.querySelector('#loader')!;

        if (!loader) {
            const app = DomUtils.GetApp();
            const newLoader = document.createElement('div');
            newLoader.id = 'loader';
            app.appendChild(newLoader);
            return newLoader;
        }

        return loader as HTMLDivElement;
    }
}
