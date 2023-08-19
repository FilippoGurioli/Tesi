class TurnView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log("Created: " + this.viewId + " for model: " + this.model.id + " - " + this.parentView.viewId);

        this.#initializeScene();
        
        if (this.#isMyTurn()) {
            this.addMenu();
        }
        
        this.subscribe(this.viewId, "yourTurn", this.addMenu);
        this.subscribe(this.viewId, "endTurn", this.removeMenu);
        this.updateTurnHUD();
    }

    #initializeScene() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.GUIManager = new BABYLON.GUI.GUI3DManager(this.parentView.scene);
        this.GUIManager.useRealisticScaling = true;

        //HUD
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
        this.advancedTexture.addControl(this.turnHUD);

        this.turnText = new BABYLON.GUI.TextBlock();
        this.turnText.color = "white";
        this.turnText.fontSize = 24;
        this.turnText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.turnText.paddingLeft = "20px";
        this.turnHUD.addControl(this.turnText);

        //Menu
        this.turnMenu = new BABYLON.GUI.NearMenu("TurnMenu");
        this.turnMenu.position = new BABYLON.Vector3(0, 0, 1);
        this.button = new BABYLON.GUI.TouchHolographicButton();
        this.button.text = "Next phase";
        this.button.onPointerDownObservable.add(() => {
            this.publish(this.model.id, "nextPhase");
        });
        this.buttonH = new BABYLON.GUI.TouchHolographicButton();
        this.buttonH.text = "Heal";
        this.buttonH.onPointerDownObservable.add(() => {
            this.publish(this.viewId, "heal", 1000);
        });
        this.buttonD = new BABYLON.GUI.TouchHolographicButton();
        this.buttonD.text = "Damage";
        this.buttonD.onPointerDownObservable.add(() => {
            this.publish(this.viewId, "damage", 1000);
        });
    }

    #isMyTurn() {
        return (this.viewId === this.parentView.model.playersInfo.p1.viewId && this.model.turn.isPlayer1Turn) ||
               (this.viewId === this.parentView.model.playersInfo.p2.viewId && !this.model.turn.isPlayer1Turn);
    }

    addMenu() {
        this.parentView.overlayText("Your turn");

        this.GUIManager.addControl(this.turnMenu);
        this.turnMenu.addButton(this.button);
        this.turnMenu.addButton(this.buttonH);
        this.turnMenu.addButton(this.buttonD);
    }

    removeMenu() {
        this.parentView.overlayText("Opponent's turn");
        this.GUIManager.removeControl(this.turnMenu);
        this.turnMenu.removeControl(this.button);
        this.turnMenu.removeControl(this.buttonH);
        this.turnMenu.removeControl(this.buttonD);
    }

    Log(string) {
        console.log("TURNVIEW: " + string);
    }

    updateTurnHUD() {
        this.turnText.text = "Turn: " + this.model.turn.turn + 
        "\nPlayer" + (this.model.turn.isPlayer1Turn ? "1": "2") + "'s turn" + 
        "\nPhase: " + this.model.turn.phase;
        this.future(500).updateTurnHUD();
    }

    discardUncoverableObjects() {
        this.turnMenu.removeControl(this.button);
        this.turnMenu.removeControl(this.buttonH);
        this.turnMenu.removeControl(this.buttonD);
        this.GUIManager.removeControl(this.turnMenu);
    }

    restoreUncoverableObjects() {
        if (this.#isMyTurn()) {
            this.addMenu();
        }
    }

    detach() {
        super.detach();
        this.turnHUD.dispose();
        this.button.dispose();
        this.buttonH.dispose();
        this.buttonD.dispose();
        this.turnMenu.dispose();
        this.advancedTexture.dispose();
        this.GUIManager.dispose();
        this.Log("Detached");
    }
}

export { TurnView };