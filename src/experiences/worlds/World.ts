import Experience from "../Experience";
import Environment from "./Environment";
import TemplateMesh from "./components/TemplateMesh";
import TemplateModel from "./components/TemplateModel";
import type ActorBase from "./components/bases/ActorBase";

export default class World {
    private declare _environment: Environment;
    private readonly _actors: ActorBase[];

    constructor() {
        this._generateEnvironment();

        this._actors = [];
        this._generateActors();
    }

    private _generateEnvironment(): void {
        this._environment = new Environment();
        Experience.Scene.add(this._environment);
    }

    private _generateActors(): void {
        this._actors.push(new TemplateMesh());
        this._actors.push(new TemplateModel());
        for (const actor of this._actors) Experience.Scene.add(actor);
    }

    public update(dt: number): void {
        if (!this._environment) return;
        this._environment.update(dt);

        for (const actor of this._actors) actor.update(dt);
    }
}
