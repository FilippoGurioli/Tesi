class BaseView extends Croquet.View {
    children = [];
    sceneObjects = [];
    sharedComponents = sharedComponents;
    constructor(data) {
        this.model = data?.model;
        this.parent = data?.parent;
        this._log("Created. Model associated: " + this.model.id.substring(this.model.id.length - 2));
        this.subscribe(this.sessionId, "game-over", this._gameOver);
        this._subscribeAll();
        this._initialize(data);
        this._initializeScene();
    }
    update(data) {
        this.children?.forEach(c => c.update(data));
        this._update(data);
    }
    _gameOver(data) {
        const timeToWait = this._endScene(data);
        this._log("game-over, ttw: " + timeToWait);
        if (timeToWait !== undefined)  this.future(timeToWait).detach();
        else this.detach();
    }
    detach(skipForwarding = false) {
        super.detach();
        this.children.forEach(c => c.detach());
        this.sceneObjects.forEach(o => o.dispose());
        this._log("detach");
    }
    _log(message) {
        console.log(this.constructor.name.toUpperCase() + ": " + message);
    }
}