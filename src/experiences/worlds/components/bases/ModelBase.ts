import { AnimationAction, AnimationMixer, type Group } from "three";
import { AssetId } from "../../../constants/experiences/AssetId";
import ThreeAssetsManager from "../../../managers/ThreeAssetsManager";
import ActorBase from "./ActorBase";

interface IAnimation {
    mixer?: AnimationMixer;
    actions?: AnimationAction;
    activeAction?: Group | null;
    previousAction?: Group | null;
}

interface IModelBaseParams {
    isAnimated?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
}

export default class ModelBase extends ActorBase {
    protected _parameters: IModelBaseParams;
    protected declare _model: Group;
    protected declare _animation: IAnimation;

    constructor(assetId: AssetId, params: IModelBaseParams = {}) {
        super();
        this._parameters = params || {};
        this._model = ThreeAssetsManager.GetModel(assetId).scene.clone();
        this._model.traverse((child: any) => {
            if (child.isMesh) {
                if (this._parameters.castShadow) child.castShadow = true;
                if (this._parameters.receiveShadow) child.receiveShadow = true;
            }
        });
        this.add(this._model);

        if (this._parameters.isAnimated) {
            const mixer = new AnimationMixer(this._model);
            this._animation = {
                mixer: mixer,
                actions: mixer.clipAction(ThreeAssetsManager.GetModel(assetId).animations[0]),
            };
        }
    }

    public update(dt: number): void {
        super.update(dt);
        if (this._parameters.isAnimated && this._animation.mixer) this._animation.mixer.update(dt);
    }
}