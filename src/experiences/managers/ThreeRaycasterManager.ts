import { Object3D, Raycaster, Vector2, type Intersection, type Object3DEventMap } from "three";
import Experience from "../Experience";
import MouseManager from "./MouseManager";

export default class ThreeRaycasterManager {
    private static _Raycaster: Raycaster;

    public static Init(): void {
        this._Raycaster = new Raycaster();
    }

    public static Cast(objects: Object3D[]): Intersection<Object3D<Object3DEventMap>>[] {
        this._Raycaster.setFromCamera(new Vector2(MouseManager.CentralX, MouseManager.CentralY), Experience.CameraController.camera);
        const intersects = this._Raycaster.intersectObjects(objects, true);
        return intersects;
    }
}
