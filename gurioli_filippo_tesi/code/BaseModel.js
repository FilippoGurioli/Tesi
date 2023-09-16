class BaseModel extends Croquet.Model {
    init(data) {
        this.parent = data?.parent;
        this._log("Created");
        this.subscribe(this.sessionId, "game-over", this._gameOver);
        this._subscribeAll();
        this._initialize(data);
    }
    _log(message) {
        console.log(this.constructor.name.toUpperCase() + " | " + this.id.substring(this.id.length - 2) + ": " + message);
    }
    _gameOver() {
        this._log("Destroy");
        this.future(100).destroy();
    }
}