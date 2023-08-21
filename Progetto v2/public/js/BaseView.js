class BaseView extends Croquet.View {
    
    //fare la detach

    constructor(model) {
        super(model);
        this.model = model;
        this._log("Created");
        this._subscribeAll();
        this._initialize();
        this._initializeScene();
    }

    _log(message) {
        console.log(this.constructor.name.toUpperCase() + ": " + message);
    }
}

export { BaseView };