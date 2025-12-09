import { Mesh, Object3D, PlaneGeometry } from 'three';
import LoaderMaterial from '../../../../materials/threes/loaders/LoaderMaterial';

export default class ThreeTemplateLoader extends Object3D {
    declare private _geometry: PlaneGeometry;
    declare private _material: LoaderMaterial;
    declare private _loader: Mesh;

    //#region Constants
    //
    private static readonly _DEFAULT_SIZE_WIDTH: number = 2;
    private static readonly _DEFAULT_SIZE_HEIGHT: number = 2;
    private static readonly _DEFAULT_SEGMENTS_WIDTH: number = 1;
    private static readonly _DEFAULT_SEGMENTS_HEIGHT: number = 1;
    //
    //#endregion

    constructor() {
        super();

        this._generateGeometry();
        this._generateMaterial();
        this._generateMesh();

        this.add(this._loader);
    }

    private _generateGeometry(): void {
        this._geometry = new PlaneGeometry(
            ThreeTemplateLoader._DEFAULT_SIZE_WIDTH,
            ThreeTemplateLoader._DEFAULT_SIZE_HEIGHT,
            ThreeTemplateLoader._DEFAULT_SEGMENTS_WIDTH,
            ThreeTemplateLoader._DEFAULT_SEGMENTS_HEIGHT
        );
    }

    private _generateMaterial(): void {
        this._material = new LoaderMaterial();
    }

    private _generateMesh(): void {
        this._loader = new Mesh(this._geometry, this._material);
    }

    //#region Getters
    //
    public get material(): LoaderMaterial {
        return this._material;
    }
    //
    //#endregion
}
