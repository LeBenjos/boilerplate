import { Object3D } from "three";

export default class ActorBase extends Object3D {
    constructor() {
        super();
    }

    public update(_dt: number): void { }
}