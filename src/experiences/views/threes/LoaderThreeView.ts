import { Mesh, Object3D, PlaneGeometry } from "three";
import LoaderMaterial from "../../materials/threes/loaders/LoaderMaterial";

export default class LoaderThreeView extends Object3D {
    private declare _geometry: PlaneGeometry;
    private declare _material: LoaderMaterial;
    private declare _mesh: Mesh;

    constructor() {
        super();

        this._generateGeometry();
        this._generateMaterial();
        this._generateMesh();

        this.add(this._mesh);
    }

    private _generateGeometry(): void {
        this._geometry = new PlaneGeometry(2, 2, 1, 1);
    }

    private _generateMaterial(): void {
        this._material = new LoaderMaterial();
    }

    private _generateMesh(): void {
        this._mesh = new Mesh(this._geometry, this._material);
    }
}
