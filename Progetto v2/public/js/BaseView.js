/**
 * This class is used to store all the shared components of the application. It is a singleton and it is used to share
 * the same components between all models and views. It is initialized only once and it is never modified.
 */
class SharedComponents {

    #engine = null;
    #scene = null;
    #camera = null;
    #xrHelper = null;
    #light = null;
    #GUIManager = null;
    #tokens = { engine: true, scene: true, camera: true, xr: true, light: true, GUIManager: true };

    /**
         * @param {BABYLON.Engine} value, the engine to set.
         */
    set engine(value) {
        if (this.#tokens.engine) {
            this.#engine = value;
            this.#tokens.engine = false;
        } else {
            throw new Error("Engine already initialized");
        }
    }

    get engine() {
        return this.#engine;
    }

    /**
     * @param {BABYLON.Scene} value, the scene to set.
     */
    set scene(value) {
        if (this.#tokens.scene) {
            this.#scene = value;
            this.#tokens.scene = false;
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
        if (this.#tokens.camera) {
            this.#camera = value;
            this.#tokens.camera = false;
        } else {
            throw new Error("Camera already initialized");
        }
    }

    get camera() {
        return this.#camera;
    }

    /**
     * @param {BABYLON.XRHelper} value, the xrHelper to set.
     */
     set xrHelper(value) {
        if (this.#tokens.xr) {
            this.#xrHelper = value;
            this.#tokens.xr = false;
        } else {
            throw new Error("xrHelper already initialized");
        }
    }

    get xrHelper() {
        return this.#xrHelper;
    }

    /**
     * @param {BABYLON.Light} value, the light to set.
     */
    set light(value) {
        if (this.#tokens.light) {
            this.#light = value;
            this.#tokens.light = false;
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
        if (this.#tokens.GUIManager) {
            this.#GUIManager = value;
            this.#tokens.GUIManager = false;
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

    constructor(data) {
        if (data.hasOwnProperty("model")) {
            super(data.model);
            this.model = data.model;
        } else { //the first view initialized by croquet has only the ref to the model.
            super(data);
            this.model = data;
        }
        this.parent = data.parent;
        this._log("Created. Model associated: " + this.model.id.substring(this.model.id.length - 2));
        this.subscribe(this.sessionId, "game-over", this._gameOver);
        this._subscribeAll();   //Croquet subscription method
        this._initialize(data); //Variables init method
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

    _endScene() {}

    _gameOver(data) {
        const timeToWait = this._endScene(data);
        this._log("game-over, ttw: " + timeToWait);
        if (timeToWait !== undefined)  this.future(timeToWait).detach();
        else this.detach(true);
    }

    detach(skipForwarding = false) {
        super.detach();
        if (!skipForwarding) this.children.forEach(c => c.detach()); //the if is used to forward only if is croquet who calls detach
        this.sceneObjects.forEach(o => o.dispose());
        this._log("detach");
    }

    _log(message) {
        console.log(this.constructor.name.toUpperCase() + ": " + message);
    }
}

export { BaseView };