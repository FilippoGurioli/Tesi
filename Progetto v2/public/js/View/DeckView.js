import { BaseView } from "../BaseView.js";

class DeckView extends BaseView {

    _initializeScene() {
        this.cube = new BABYLON.MeshBuilder.CreateBox("cube", {width: 0.13, height: 0.07, depth: 0.16}, this.sharedComponents.scene);
        this.cube.position = this.sharedComponents.camera.position.clone();
        this.cube.position.y -= 0.5;
        this.cube.position.x -= 0.5;

        const behavior = new BABYLON.SixDofDragBehavior();
        behavior.disableMovement = true;
        behavior.onDragStartObservable.add(_=>{
            this.publish(this.model.id, "drawCard");
        });
        behavior.attach(this.cube);

        this.sceneObjects.push(this.cube);
    }

    _subscribeAll() {
        this.subscribe(this.model.id, "emptyDeck", this.removeDeck);
    }

    removeDeck() {
        this.sceneObjects.splice(this.sceneObjects.indexOf(this.cube), 1);
        this.cube.dispose();
    }
}

export { DeckView };