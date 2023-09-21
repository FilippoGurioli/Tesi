import { BaseView } from "../BaseView.js";

class DeckView extends BaseView {

    _initializeScene() {
        const mat = new BABYLON.StandardMaterial("mat", this.sharedComponents.scene);
        const texture = new BABYLON.Texture("https://cdn.discordapp.com/attachments/1150769991902314589/1154497415613779968/Progetto_senza_titolo_2.png", this.sharedComponents.scene);
        mat.diffuseTexture = texture;

        const cols = 6;
        const rows = 1;

        const faceUV = new Array(6);

        for (let i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(i / cols, 0, (i + 1) / cols, 1 / rows);
        }

        const options = {
            depth: 0.16,
            height: 0.07,
            width: 0.13,
            faceUV: faceUV,
            wrap: true
        };

        this.deck = new BABYLON.MeshBuilder.CreateBox("deck", options, this.sharedComponents.scene);
        this.deck.material = mat;
        this.deck.position = this.sharedComponents.camera.position.clone();
        this.deck.position.y -= 0.5;
        this.deck.position.x -= 0.5;

        const behavior = new BABYLON.SixDofDragBehavior();
        behavior.disableMovement = true;
        behavior.onDragStartObservable.add(_=>{
            this.publish(this.model.id, "drawCard");
        });
        behavior.attach(this.deck);

        this.sceneObjects.push(this.deck);
    }

    _subscribeAll() {
        this.subscribe(this.model.id, "emptyDeck", this.removeDeck);
    }

    removeDeck() {
        this.sceneObjects.splice(this.sceneObjects.indexOf(this.deck), 1);
        this.deck.dispose();
    }
}

export { DeckView };