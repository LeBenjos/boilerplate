import { PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ResizeManager } from "../managers/ResizeManager";

interface ICameraOption {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
}

export default class MainCamera extends PerspectiveCamera {
    private declare _controls: OrbitControls;

    constructor(scene: Scene, cameraOption: ICameraOption = { fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }) {
        super(cameraOption.fov, cameraOption.aspect, cameraOption.near, cameraOption.far);
        this.position.set(0, 0, 3);
        scene.add(this);

        // this._setControls();
        this.resize();
    }

    private _setControls(): void {
        this._controls = new OrbitControls(this, document.body);
        this._controls.enableDamping = true;
    }

    public resize(): void {
        this.aspect = ResizeManager.Width / ResizeManager.Height;
        this.updateProjectionMatrix();
    }

    public update(dt: number): void {
        if (this._controls) this._controls.update();
        // else this.position.y = Math.sin(Ticker.ElapsedTime);
    }
}