import { Scene } from "three";
import Environment from "./Environment";
import TemplateMesh from "./components/TemplateMesh";
import TemplateModel from "./components/TemplateModel";
import type ActorBase from "./components/bases/ActorBase";

export default class World {
    private _scene: Scene;
    private declare _environment: Environment;
    private readonly _actors: ActorBase[];

    constructor(scene: Scene) {
        this._scene = scene;
        this._generateEnvironment(scene);

        this._actors = [];
        this._generateActors();
    }

    private _generateEnvironment(scene: Scene): void {
        this._environment = new Environment(scene);
        this._scene.add(this._environment);
    }

    private _generateActors(): void {
        this._actors.push(new TemplateMesh());
        this._actors.push(new TemplateModel());
        for (const actor of this._actors) this._scene.add(actor);
    }

    public update(dt: number): void {
        if (!this._environment) return;
        this._environment.update(dt);

        for (const actor of this._actors) actor.update(dt);
    }
}
