import MainThree from "../../../engine/threes/MainThree";
import Environment from "./components/Environment";
import TemplateFont from "./components/actors/TemplateFont";
import TemplateMesh from "./components/actors/TemplateMesh";
import TemplateModel from "./components/actors/TemplateModel";
import type ActorBase from "./components/actors/bases/ActorBase";

export default class WorldThreeView {
    private declare _environment: Environment;
    private readonly _actors: ActorBase[];

    constructor() {
        this._actors = [];

        this._generateEnvironment();
        this._generateActors();
    }

    private _generateEnvironment(): void {
        this._environment = new Environment();

        MainThree.Scene.add(this._environment);
    }

    private _generateActors(): void {
        this._actors.push(new TemplateMesh());
        this._actors.push(new TemplateModel());
        this._actors.push(new TemplateFont());

        for (const actor of this._actors) MainThree.Scene.add(actor);
    }

    public update(dt: number): void {
        if (!this._environment) return;

        this._environment.update(dt);
        for (const actor of this._actors) actor.update(dt);
    }
}
