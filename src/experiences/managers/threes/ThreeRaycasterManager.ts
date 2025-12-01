import { Object3D, Raycaster, Vector2, type Intersection, type Object3DEventMap } from "three";
import Experience from "../../Experience";
import MouseManager from "../MouseManager";


export default class ThreeRaycasterManager {
    private static readonly _Raycaster = new Raycaster();

    public static Init(): void {
        //
    }

    public static CastFromCameraToMouse(objects: Object3D[], recursive: boolean = true): Intersection<Object3D<Object3DEventMap>>[] {
        ThreeRaycasterManager._Raycaster.setFromCamera(new Vector2(MouseManager.CentralX, MouseManager.CentralY), Experience.CameraController.camera);
        const intersects = ThreeRaycasterManager._Raycaster.intersectObjects(objects, recursive);
        return intersects;
    }
}
