import { canvas } from "./model.js";

class RootView extends Croquet.View {

    /**
    * Constructor for the class.
    * @param {any} model the model of reference
    */
    constructor(model) {
        super(model);
        this.model = model;
        console.log("VIEW subscribed ");
        //TODO: creare oggetti di scena per l'interazione utente + lanciare eventi all'interazione
        this.#addMenu();
    }

    //TODO: creare metodi per gestire gli eventi ricevuti dal modello

    #addMenu() {
        const nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        this.model.GUIManager.addControl(nearMenu);
        nearMenu.isPinned = true;
        nearMenu.position = new BABYLON.Vector3(-0.2, 1.2, 0.5);
        const button = new BABYLON.GUI.TouchHolographicButton();
        button.text = "Change phase";
        button.onPointerDownObservable.add(() => {
            this.publish("changePhase", "clicked");
        });
        nearMenu.addButton(button);
    }
}

export { RootView };