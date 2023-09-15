class TurnView extends BaseView {
    _initialize(data) {
        this.role = data.role;
    }
    _initializeScene() {
        this.turnMenu = new BABYLON.GUI.NearMenu("Turn Menu");
        this.button = new BABYLON.GUI.TouchHolographicButton("Next Phase");
        this.button.onPointerDownObservable.add(() => this.publish(this.model.id, "nextPhase"));
        this.turnMenu.addButton(this.button);
        this.turnMenu.isVisible = false;
        this.sceneObjects.push(this.turnMenu, this.button);
    }
    _update() {
        if (this.model.isPlayer1Turn && this.role === "Player 1" || !this.model.isPlayer1Turn && this.role === "Player 2") this.turnMenu.isVisible = true;
        else if (this.model.isPlayer1Turn && this.role === "Player 2" || !this.model.isPlayer1Turn && this.role === "Player 1") this.turnMenu.isVisible = false;
    }
}