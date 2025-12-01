import { AssetId } from "../../../../../constants/experiences/AssetId";
import DebugManager from "../../../../../managers/DebugManager";
import ModelBase from "./bases/ModelBase";

export default class TemplateModel extends ModelBase {
    constructor() {
        super(AssetId.THREE_GLTF_TEMPLATE, {
            castShadow: true,
            receiveShadow: true,
        });
        this.position.set(0, 1, 0);

        if (DebugManager.IsActive) {
            const templateModelFolder = DebugManager.Gui.addFolder("Template Model");
            templateModelFolder.add(this.position, "y", -1, 1, 0.01).name("positionY");
        }
    }

    public update(dt: number): void {
        super.update(dt);
        this.rotation.y += dt * 0.25;
    }
}