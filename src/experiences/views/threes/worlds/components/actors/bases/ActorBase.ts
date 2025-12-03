import { Object3D } from "three";

export default abstract class ActorBase extends Object3D {
    constructor() {
        super();
    }

    public update(dt: number): void { }
}
