import { AssetId } from "../../constants/experiences/AssetId";
import ModelBase from "./bases/ModelBase";

export default class TemplateModel extends ModelBase {
    constructor() {
        super(AssetId.TEMPLATE_MODEL, {
            isAnimated: false,
            castShadow: true,
            receiveShadow: true,
        });
    }

    public update(_dt: number): void {
        super.update(_dt);
        this._model.rotation.y += _dt * 0.25;
    }
}