import { AssetId } from "../../../constants/experiences/AssetId";
import DebugManager from "../../../managers/DebugManager";
import ModelBase from "./bases/ModelBase";

export default class TemplateModel extends ModelBase {
    constructor() {
        super(AssetId.GLTF_TEMPLATE, {
            isAnimated: false,
            castShadow: true,
            receiveShadow: true,
        });
        this._model.position.set(0, 1, 0);

        if (DebugManager.IsActive) {
            const templateModelFolder = DebugManager.Gui.addFolder("Template Model");
            templateModelFolder.add(this._model.position, "y", -1, 1, 0.01).name("positionY");
        }
    }

    public update(dt: number): void {
        super.update(dt);
        this._model.rotation.y += dt * 0.25;
    }
}