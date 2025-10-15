import { AnimationAction, AnimationMixer, type Group } from "three";
import { AssetId } from "../../../constants/experiences/AssetId";
import ThreeAssetsManager from "../../../managers/ThreeAssetsManager";
import ActorBase from "./ActorBase";

interface IAnimation {
    mixer?: AnimationMixer;
    actions?: { [key: string]: AnimationAction };
    play?: (name: string) => void;
}

interface IModelBaseParams {
    isAnimated?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
}

export default class ModelBase extends ActorBase {
    protected _assetId: AssetId;
    protected _parameters: IModelBaseParams;
    protected declare _model: Group;
    protected declare _animation: IAnimation;

    constructor(assetId: AssetId, params: IModelBaseParams = {}) {
        super();
        this._assetId = assetId;
        this._parameters = params || {};

        this._generateModel();
        this._generateAnimations();
    }

    private _generateModel = (): void => {
        this._model = ThreeAssetsManager.GetModel(this._assetId).scene.clone();
        this._model.traverse((child: any) => {
            if (child.isMesh) {
                if (this._parameters.castShadow) child.castShadow = true;
                if (this._parameters.receiveShadow) child.receiveShadow = true;
            }
        });
        this.add(this._model);
    }

    private _generateAnimations(): void {
        if (!this._parameters.isAnimated) return;
        const mixer = new AnimationMixer(this._model);
        this._animation = {
            mixer: mixer,
            actions: {},
            play: this._onAnimationPlay,
        };
    }

    private _addAnimationAction(name: string, action: AnimationAction): void {
        if (!this._animation.actions) return;
        this._animation.actions[name] = action;
    }

    private _onAnimationPlay = (name: string): void => {
        if (!this._animation.actions) return;
        const newAction = this._animation.actions[name];
        const oldAction = this._animation.actions.current || null;

        newAction.reset();
        newAction.play();
        if (oldAction) newAction.crossFadeFrom(oldAction, 1);
        this._animation.actions.current = newAction;
    }

    public update(dt: number): void {
        super.update(dt);
        if (this._parameters.isAnimated && this._animation.mixer) this._animation.mixer.update(dt);
    }
}