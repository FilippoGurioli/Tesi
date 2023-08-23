/**
 * This class is used to store all the shared components of the application. It is a singleton and it is used to share
 * the same components between all models and views. It is initialized only once and it is never modified.
 */
class SharedComponents {

    #scene = null;
    #camera = null;
    #xrCamera = null;
    #light = null;
    #GUIManager = null;
    tokens = {scene: true, camera: true, xr: true, light: true, GUIManager: true };

    /**
     * @param {BABYLON.Scene} value, the scene to set.
     */
    set scene(value) {
        if (this.tokens.scene) {
            this.#scene = value;
            this.tokens.scene = false;
        } else {
            throw new Error("Scene already initialized");
        }
    }

    get scene() {
        return this.#scene;
    }

    /**
     * @param {BABYLON.Camera} value, the camera to set.
     */
    set camera(value) {
        if (this.tokens.camera) {
            this.#camera = value;
            this.tokens.camera = false;
        } else {
            throw new Error("Camera already initialized");
        }
    }

    get camera() {
        return this.#camera;
    }

    /**
     * @param {BABYLON.WebXRCamera} value, the xrCamera to bind to the normal camera.s
     */
    set bindedXRCamera(value) {
        //if (xr) {
            this.#xrCamera = value;
            this.#camera.onViewMatrixChangedObservable.add(function () {
                console.log("aggiornamento");
                this.#xrCamera.setTransformationFromNonVRCamera();
            });
        // } else {
        //     throw new Error("XRCamera already initialized");
        // }
    }

    /**
     * @param {BABYLON.Light} value, the light to set.
     */
    set light(value) {
        if (this.tokens.light) {
            this.#light = value;
            this.tokens.light = false;
        } else {
            throw new Error("Light already initialized");
        }
    }

    get light() {
        return this.#light;
    }

    /**
     * @param {BABYLON.GUIManager} value, the GUIManager to set.
     */
    set GUIManager(value) {
        if (this.tokens.GUIManager) {
            this.#GUIManager = value;
            this.tokens.GUIManager = false;
        } else {
            throw new Error("GUIManager already initialized");
        }
    }

    get GUIManager() {
        return this.#GUIManager;
    }
}

const sharedComponents = new SharedComponents();

class BaseView extends Croquet.View {

    /**
     * All views created by this view must be placed here.
     */
    children = [];

    /**
     * All BABYLONJS objects initialized by this view must be placed here.
     */
    sceneObjects = [];

    /**
     * The shared components of the application.
     * @param {SharedComponents} sharedComponents, the shared components of the application.
     */
    sharedComponents = sharedComponents;

    constructor(model) {
        super(model);
        this.model = model;
        this._log("Created");
        this._subscribeAll();   //Croquet subscription method
        this._initialize();     //Variables init method
        this._initializeScene();//BABYLON scene init method
    }

    update(data) {
        this.children?.forEach(c => c.update(data));
        this._update(data);
    }

    _subscribeAll() {}
    
    _initialize() {}

    _initializeScene() {}

    _update(data) {}


    detach() {
        super.detach();
        this.children.forEach(c => c.detach());
        this.sceneObjects.forEach(o => o.dispose());
        this._log("detach");
    }

    _log(message) {
        console.log(this.constructor.name.toUpperCase() + ": " + message);
    }
}

export { BaseView };