import { BaseView } from "../BaseView.js";

class TurnView extends BaseView {

    _initialize(data) {
        this.myTurn = data.myTurn;
    }

    _subscribeAll() {
        this.subscribe(this.model.id, "changeTurn", this.changeTurn);
    }

    _initializeScene() {
        this.turnMenu = new BABYLON.GUI.NearMenu("TurnMenu");
        this.button = new BABYLON.GUI.TouchHolographicButton();
        this.button.text = "Next phase";
        this.button.onPointerDownObservable.add(() => {
            this.publish(this.model.id, "nextPhase");
        });
        if (this.myTurn) {
            this.#addMenu();
        }

        this.sceneObjects.push(this.turnMenu, this.button);
    }

    changeTurn(data) {
        if (this.viewId === data.view) {
            this.#addMenu();
        } else {
            this.#removeMenu();
        }
    }

    #addMenu() {
        this.sharedComponents.GUIManager.addControl(this.turnMenu);
        this.turnMenu.addButton(this.button);
    }

    #removeMenu() {
        this.sharedComponents.GUIManager.removeControl(this.turnMenu);
        this.turnMenu.removeControl(this.button);
    }

}

export { TurnView };