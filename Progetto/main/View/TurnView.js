class TurnView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.turnMenu = null;
        if (((this.model.turn.turn + 1) % 2) + 1 === this.parentView.getPlayer()) {
            this.addMenu();
        }

        this.#addTurnHUD();

        this.subscribe(this.viewId, "yourTurn", this.addMenu);
        this.subscribe(this.viewId, "endTurn", this.removeMenu);
    }

    addMenu() {
        this.parentView.overlayText("Your turn");
        this.turnMenu = new BABYLON.GUI.NearMenu("TurnMenu");
        this.turnMenu.position = new BABYLON.Vector3(0, 0, 1);
        this.button = new BABYLON.GUI.TouchHolographicButton();
        this.button.text = "Next phase";
        this.button.onPointerDownObservable.add(() => {
            this.publish(this.model.id, "nextPhase");
        });
        var buttonH = new BABYLON.GUI.TouchHolographicButton();
        var buttonD = new BABYLON.GUI.TouchHolographicButton();
        buttonH.text = "Heal";
        buttonD.text = "Damage";
        
        var GUIManager = new BABYLON.GUI.GUI3DManager(this.parentView.scene);
        GUIManager.useRealisticScaling = true;
        GUIManager.addControl(this.turnMenu);
        this.turnMenu.addButton(this.button);
    }

    removeMenu() {
        this.parentView.overlayText("Opponent's turn");
        this.turnMenu.dispose();
    }

    Log(string) {
        console.log("TURNVIEW: " + string);
    }

    #addTurnHUD() {
        this.turnHUD = new BABYLON.GUI.Rectangle();
        this.turnHUD.width = "300px";
        this.turnHUD.height = "120px";
        this.turnHUD.cornerRadius = 20;
        this.turnHUD.color = "Blue";
        this.turnHUD.thickness = 4;
        this.turnHUD.background = "black";
        this.turnHUD.alpha = 0.5;
        this.turnHUD.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.turnHUD.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.addControl(this.turnHUD);

        this.turnText = new BABYLON.GUI.TextBlock();
        this.turnText.color = "white";
        this.turnText.fontSize = 24;
        this.turnText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.turnText.paddingLeft = "20px";
        this.turnHUD.addControl(this.turnText);
        this.updateTurnHUD();
    }

    updateTurnHUD() {
        this.turnText.text = "Turn: " + this.model.turn.turn + 
        "\nPlayer" + (this.model.turn.isPlayer1Turn ? "1": "2") + "'s turn" + 
        "\nPhase: " + this.model.turn.phase;
        this.future(500).updateTurnHUD();
    }

    discardUncoverableObjects() {
        this.turnMenu?.dispose();
    }

    restoreUncoverableObjects() {
        if (((this.model.turn.turn + 1) % 2) + 1 === this.parentView.getPlayer()) {
            this.addMenu();
        }
    }

    detach() {
        super.detach();
        this.turnHUD.dispose();
        this.turnMenu?.dispose();
    }
}

export { TurnView };