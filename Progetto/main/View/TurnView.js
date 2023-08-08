import { Role } from "./Role.js";

class TurnView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.turnMenu = null;
        if (this.parentView.role === Role.PLAYER1 && this.model.turn.turn % 2 === 1 ||
            this.parentView.role === Role.PLAYER2 && this.model.turn.turn % 2 === 0) {
            this.#addMenu();
        }
        this.subscribe(this.model.id, "changeTurn", this.changeTurn);
    }

    changeTurn(viewId) {
        if (viewId === this.viewId) {
            this.#addMenu();
        } else {
            this.turnMenu?.dispose();
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
        this.parentView.parentView.GUIManager.addControl(this.turnMenu);  //!FIX: brutto e inestendibile
        this.turnMenu.addButton(this.button);
    }

    Log(string) {
        console.log("TURNVIEW: " + string);
    }
}

export { TurnView };