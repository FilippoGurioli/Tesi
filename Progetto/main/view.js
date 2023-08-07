import { Role } from "./Model/Role.js";

class RootView extends Croquet.View {

    /**
    * Constructor for the class.
    * @param {any} model the model of reference
    */
    constructor(model) {
        super(model);
        this.model = model;

        this.Log("Questa pagina è legata al modello " + this.model.id + ".");
        this.nearMenu = null;
        
        this.#setRole();

        if (this.role === Role.PLAYER1 && this.model.turn.turn % 2 === 1) {
            this.#addMenu();
        } else if (this.role === Role.PLAYER2 && this.model.turn.turn % 2 === 0) {
            this.#addMenu();
        }

        this.subscribe(this.model.id, "changeTurn", this.changeTurn);
    }
    //TODO: creare metodi per gestire gli eventi ricevuti dal modello

    changeTurn(viewId) {
        if (viewId === this.viewId) {
            this.#addMenu();
        } else {
            this.nearMenu.dispose();
        }
    }

    #addMenu() {
        this.nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        this.nearMenu.position = new BABYLON.Vector3(0, 0, 1);
        this.button = new BABYLON.GUI.TouchHolographicButton();
        this.button.text = "Next phase";
        this.button.onPointerDownObservable.add(() => {
            this.publish("nextPhase", "clicked");
        });
        this.model.GUIManager.addControl(this.nearMenu);
        this.nearMenu.addButton(this.button);
    }

    #setRole() {
        if (this.model.players.p1 === this.viewId) {
            this.role = Role.PLAYER1;
            this.#HUDText("You are Player 1", 3000);
        } else if (this.model.players.p2 === this.viewId) {
            this.role = Role.PLAYER2;
            this.#HUDText("You are Player 2", 3000);
        } else {
            this.role = Role.SPECTATOR;
            this.#HUDText("You are a Spectator", 3000);
        }
    }

    #HUDText(text, time = 0) {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = text;
        textBlock.color = "white";
        textBlock.fontSize = 48;
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(textBlock);
        
        setTimeout(() => {
            advancedTexture.dispose();
        }, time);
    }

    Log(string) {
        console.log("VIEW: " + string);
    }
}

export { RootView };