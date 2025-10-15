import { Scene } from "three";
import MainCamera from "./cameras/MainCamera";
import { ResizeManager } from "./managers/ResizeManager";
import ThreeAssetsManager from "./managers/ThreeAssetsManager";
import Renderer from "./renderers/Renderer";
import World from "./worlds/World";

export default class Experience {
    private _canvas: HTMLCanvasElement;
    private _scene: Scene;
    private _camera: MainCamera;
    private _renderer: Renderer;
    private declare _world: World;

    constructor(canvas: HTMLCanvasElement) {
        window.experience = this;

        this._canvas = canvas;
        this._scene = new Scene();
        this._camera = new MainCamera(this._scene);
        this._renderer = new Renderer(this._scene, this._camera, { canvas: this._canvas, antialias: true });

        this._onResize();
        ResizeManager.OnResize.add(this._onResize);
        ThreeAssetsManager.OnFinishLoad.add(this._generateWorld);
    }

    private _generateWorld = (): void => {
        this._world = new World(this._scene);
    }

    private _onResize = (): void => {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;

        this._camera.resize();
        this._renderer.resize();
    }

    public update(dt: number): void {
        this._camera.update(dt);
        this._renderer.update(dt);
        if (this._world) this._world.update(dt);
    }
}
