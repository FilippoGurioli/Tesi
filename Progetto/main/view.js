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
        
        this.#setRole();

        //TODO: creare oggetti di scena per l'interazione utente + lanciare eventi all'interazione
        this.#addMenu();
        // const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // const textBlock = new BABYLON.GUI.TextBlock();
        // textBlock.text = "Testo di esempio";
        // textBlock.color = "white";
        // textBlock.fontSize = 48;
        // textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        // textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        // advancedTexture.addControl(textBlock);

        // setTimeout(() => {
        //     advancedTexture.removeControl(textBlock);
        // }, 3000);
    }
    //TODO: creare metodi per gestire gli eventi ricevuti dal modello

    #addMenu() {
        const nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        this.model.GUIManager.addControl(nearMenu);
        nearMenu.position = new BABYLON.Vector3(-0.2, 1.2, 0.5);
        const button = new BABYLON.GUI.TouchHolographicButton();
        button.text = "Next phase";
        button.onPointerDownObservable.add(() => {
            this.publish("nextPhase", "clicked");
        });
        nearMenu.addButton(button);
    }

    #setRole() {
        this.role = Role.SPECTATOR;
        if (this.model.players.p1 === this.viewId) {
            this.role = Role.PLAYER1;
            this.Log("I'm player 1");
        } else if (this.model.players.p2 === this.viewId) {
            this.role = Role.PLAYER2;
            this.Log("I'm player 2");
        } else {
            this.Log("I'm a spectator");
        }
    }

    Log(string) {
        console.log("VIEW: " + string);
    }
}

export { RootView };