
/**
 * Babylon objects that need to be shared between all views.
 */
class SharedComponents {
    firstScene = true;

    /**
     * Set the scene only the first time.
     * @param {BABYLON.Scene} scene
     */
    set scene(scene) {
        if (firstScene) {
            firstScene = false;
            this.scene = scene;
            Object.freeze(this.scene);
        }
    }

    get scene() {
        return this.scene;
    }
}

class BaseView extends Croquet.View {

    /**
     * All views created by this view must be placed here.
     */
    children = [];

    /**
     * All BABYLONJS objects initialized by this view must be placed here.
     */
    sceneObjects = [];

    constructor(model) {
        super(model);
        this.model = model;
        this._log("Created");
        this._subscribeAll();   //Croquet subscription method
        this._initialize();     //Variables init method
        this._initializeScene();//BABYLON scene init method
    }

    _subscribeAll() {}
    
    _initialize() {}

    _initializeScene() {}

    update(data) {
        this.children?.forEach(c => c.update(data));
        this._update(data);
    }

    detach() {
        super.detach();
        this.children.forEach(c => c.detach());
        this.sceneObjects.forEach(o => o?.dispose());
        this._log("detach");
    }

    _log(message) {
        console.log(this.constructor.name.toUpperCase() + ": " + message);
    }
}

export { BaseView };