import { AnimationAction, AnimationMixer, Mesh, Object3D, type Group } from "three";
import { AssetId } from "../../../constants/experiences/AssetId";
import type { Object3DId } from "../../../constants/experiences/Object3dId";
import ThreeAssetsManager from "../../../managers/ThreeAssetsManager";
import ActorBase from "./ActorBase";

interface IAnimation {
    mixer?: AnimationMixer;
    actions?: { [key: string]: AnimationAction };
    play?: (name: string) => void;
}

interface IModelBaseParams {
    object3DId?: Object3DId;
    isAnimated?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
}

export default class ModelBase extends ActorBase {
    protected _assetId: AssetId;
    protected _parameters: IModelBaseParams;
    protected declare _model: Group | Object3D | Mesh;
    protected declare _animation: IAnimation;

    constructor(assetId: AssetId, params: IModelBaseParams = {}) {
        super();
        this._assetId = assetId;
        this._parameters = params || {};

        this._generateModel();
        this._generateAnimations();
    }

    protected _generateModel(): void {
        const model = ThreeAssetsManager.GetModel(this._assetId).scene.clone();
        model.traverse((child: Group | Object3D | Mesh) => {
            if (this._parameters.object3DId && child.name === this._parameters.object3DId) {
                this._model = child;
            }
        });
        if (!this._parameters.object3DId) this._model = model;
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
