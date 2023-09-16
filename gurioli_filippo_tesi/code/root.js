class RootModel extends BaseModel {
    _subscribeAll() {
        this.subscribe(this.sessionId, "view-join", this.viewJoin);
    }
    _initialize() {
        this.gameModel = null;
    }
    viewJoin(viewId) {
        if (this.gameModel === null) {
            this.gameModel = GameModel.create({parent: this});
        }
    }
    _gameOver() {
        this._log("Game over: restarting game model");
        this.gameModel = GameModel.create({parent: this});
    }
}

class RootView extends BaseView {
    _initializeScene() {
        /* inizializzazione di tutti gli strumenti babylon come engine, scene, camera...*/
        const nearMenu = new BABYLON.GUI.NearMenu("Join Menu");
        const button = new BABYLON.GUI.TouchHolographicButton("Join");
        button.onPointerDownObservable.add(() => {
            this.gameView = new GameView({model: this.model.gameModel, parent: this});
            this.children.push(this.gameView);
        });
        nearMenu.addButton(button);
        this.sceneObjects.push(nearMenu);
    }
    _gameOver() {
        this._initializeScene();
    }
}