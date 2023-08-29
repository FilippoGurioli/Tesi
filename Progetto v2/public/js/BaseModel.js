/**
 * Custom base class that will be extended from all models in this project. It provides a basic API to support debugging.
 * Derived classes have to define 2 methods: _initialize where they have to put all fields initializations and _subscreAll
 * where they have to put all Croquet subscriptions. It's also possible to override the _gameOver method to define a custom
 * behaviour when the game is over.
 */
class BaseModel extends Croquet.Model {

    init(data) {
        this.parent = data?.parent;
        this._log("Created");
        this.subscribe(this.sessionId, "game-over", this._gameOver);
        this._subscribeAll();
        this._initialize(data);
    }

    _subscribeAll() {}

    _initialize() {}

    _log(message) {
        console.log(this.constructor.name.toUpperCase() + " | " + this.id.substring(this.id.length - 2) + ": " + message);
    }

    _gameOver() {
        this._log("Destroy");
        this.future(100).destroy();
    }

}

export { BaseModel };