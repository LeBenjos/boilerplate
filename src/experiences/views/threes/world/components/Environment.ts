import { DataTexture, DirectionalLight, Object3D } from "three";
import { AssetId } from "../../../../constants/experiences/AssetId";
import Experience from "../../../../Experience";
import DebugManager from "../../../../managers/DebugManager";
import ThreeAssetsManager from "../../../../managers/threes/ThreeAssetsManager";

interface IEnvironmentMap {
    intensity?: number;
    texture?: DataTexture;
}

export default class Environment extends Object3D {
    public declare _environmentMap: IEnvironmentMap;
    private declare _sunLight: DirectionalLight;

    constructor() {
        super();

        this._generateEnvironmentMap();
        this._generateSunLight();
    }

    private _generateEnvironmentMap = (): void => {
        this._environmentMap = {};
        this._environmentMap.intensity = 1;
        this._environmentMap.texture = ThreeAssetsManager.GetHDR(AssetId.THREE_HDR_TEMPLATE);
        this._environmentMap.texture.needsUpdate = true;

        Experience.Scene.environment = this._environmentMap.texture;
        Experience.Scene.environmentIntensity = this._environmentMap.intensity!;

        if (DebugManager.IsActive) {
            const environmentFolder = DebugManager.Gui.addFolder("Environment");
            environmentFolder.add(this._environmentMap, "intensity", 0, 10, 0.01).onChange(() => {
                Experience.Scene.environmentIntensity = this._environmentMap.intensity!;
            });
        }
    }

    private _generateSunLight(): void {
        this._sunLight = new DirectionalLight("#ffffff", 10);
        this._sunLight.castShadow = true;
        this._sunLight.shadow.camera.far = 15;
        this._sunLight.shadow.mapSize.set(1024, 1024);
        this._sunLight.shadow.normalBias = 0.05;
        this._sunLight.position.set(0, 2, 1);
        this.add(this._sunLight);

        if (DebugManager.IsActive) {
            const sunLightFolder = DebugManager.Gui.addFolder("Sun Light");
            sunLightFolder.add(this._sunLight, "intensity", 0, 10, 0.01).name("intensity");
            sunLightFolder.add(this._sunLight.position, "x", -5, 5, 0.01).name("positionX");
            sunLightFolder.add(this._sunLight.position, "y", -5, 5, 0.01).name("positionY");
            sunLightFolder.add(this._sunLight.position, "z", -5, 5, 0.01).name("positionZ");
        }
    }

    public update(dt: number): void { }
}
