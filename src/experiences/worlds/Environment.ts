import { DataTexture, DirectionalLight, Object3D, Scene } from "three";
import { AssetId } from "../constants/experiences/AssetId";
import ThreeAssetsManager from "../managers/ThreeAssetsManager";

interface IEnvironmentMap {
    intensity?: number;
    texture?: DataTexture;
}

export default class Environment extends Object3D {
    public declare _environmentMap: IEnvironmentMap;
    private declare _sunLight: DirectionalLight;
    private _scene: Scene;

    constructor(scene: Scene) {
        super();
        this._scene = scene;

        this._generateEnvironmentMap();
        this._generateSunLight();
    }

    private _generateEnvironmentMap = (): void => {
        this._environmentMap = {};
        this._environmentMap.intensity = 1;
        this._environmentMap.texture = ThreeAssetsManager.GetHDR(AssetId.TEMPLATE_HDR);
        this._environmentMap.texture.needsUpdate = true;

        this._scene.environment = this._environmentMap.texture;
        this._scene.environmentIntensity = this._environmentMap.intensity!;
    }

    private _generateSunLight(): void {
        this._sunLight = new DirectionalLight("#ffffff", 10);
        this._sunLight.castShadow = true;
        this._sunLight.shadow.camera.far = 15;
        this._sunLight.shadow.mapSize.set(1024, 1024);
        this._sunLight.shadow.normalBias = 0.05;
        this._sunLight.position.set(0, 2, 1);
        this.add(this._sunLight);
    }


    public update(_dt: number): void { }
}