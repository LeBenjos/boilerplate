import { Scene } from "three";
import type CameraControllerBase from "./cameras/bases/CameraControllerBase";
import MainCameraController from "./cameras/MainCamera";
import { ResizeManager } from "./managers/ResizeManager";
import ThreeAssetsManager from "./managers/ThreeAssetsManager";
import Renderer from "./renderers/Renderer";
import World from "./worlds/World";

export default class Experience {
    private _canvas: HTMLCanvasElement;
    private _scene: Scene;
    private _cameraController: CameraControllerBase;
    private _renderer: Renderer;
    private declare _world: World;

    constructor(canvas: HTMLCanvasElement) {
        window.experience = this;

        this._canvas = canvas;
        this._scene = new Scene();
        this._cameraController = new MainCameraController(this._scene, { type: "perspective", fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 });
        // this._cameraController = new DebugCameraController(this._scene, { type: "perspective", fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 });
        this._renderer = new Renderer(this._scene, this._cameraController.camera, { canvas: this._canvas, antialias: true });

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

        this._cameraController.resize();
        this._renderer.resize();
    }

    public update(dt: number): void {
        this._cameraController.update(dt);
        this._renderer.update(dt);
        if (this._world) this._world.update(dt);
    }
}
