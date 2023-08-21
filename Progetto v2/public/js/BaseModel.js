/**
 * Custom base class that will be extended from all models in this project. It provides a basic API to support debugging.
 * Derived classes have to define 2 methods: _initialize where they have to put all fields initializations and _subscreAll
 * where they have to put all Croquet subscriptions. 
 */
class BaseModel extends Croquet.Model {

    init(data) {
        this.parent = data?.parent;
        this._log("Created");
        this._subscribeAll();
        this._initialize(data);
    }

    _log(message) {
        console.log(this.constructor.name.toUpperCase() + " | " + this.id.substring(this.id.length - 2) + ": " + message);
    }

}

export { BaseModel };