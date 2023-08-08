class TurnView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.turnMenu = null;
        if (((this.model.turn.turn + 1) % 2) + 1 === this.parentView.getPlayer()) {
            this.#addMenu();
        }
        this.subscribe(this.model.id, "changeTurn", this.changeTurn);
    }

    changeTurn() { //!non mi fa impazzire...
        if (this.model.turn.isPlayer1Turn && this.parentView.getPlayer() === 1 ||
            !this.model.turn.isPlayer1Turn && this.parentView.getPlayer() === 2) {
            this.#addMenu();
            this.parentView.overlayText("Your turn");
        } else {
            this.turnMenu?.dispose();
            if (this.model.turn.isPlayer1Turn) {
                this.parentView.overlayText("Player 1's turn");
            } else {
                this.parentView.overlayText("Player 2's turn");
            }
        }
    }

    #addMenu() {
        this.turnMenu = new BABYLON.GUI.NearMenu("TurnMenu");
        this.turnMenu.position = new BABYLON.Vector3(0, 0, 1);
        this.button = new BABYLON.GUI.TouchHolographicButton();
        this.button.text = "Next phase";
        this.button.onPointerDownObservable.add(() => {
            this.publish(this.model.id, "nextPhase");
        });
        var GUIManager = new BABYLON.GUI.GUI3DManager(this.parentView.scene);
        GUIManager.useRealisticScaling = true;
        GUIManager.addControl(this.turnMenu);
        this.turnMenu.addButton(this.button);
    }

    Log(string) {
        console.log("TURNVIEW: " + string);
    }
}

export { TurnView };