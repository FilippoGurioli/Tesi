import { BaseView } from "../BaseView.js";
import { Cards } from "../Utils/Constants.js";

class HandView extends BaseView {

    _initializeScene() {

        this.hand = [];

        this.model.hand.forEach(cardId => {
            this.spawnCard(cardId);
        });
    }

    spawnCard(cardId) {
        const infos = Cards.find(function(card) {
            return card.id === cardId;
        });
        // Creazione di un materiale per la faccia 1 del piano
        const front = new BABYLON.StandardMaterial("front", this.sharedComponents.scene);
        front.diffuseTexture = new BABYLON.Texture(infos.image, this.sharedComponents.scene);

        // Creazione di un materiale per la faccia 2 del piano
        const back = new BABYLON.StandardMaterial("back", this.sharedComponents.scene);
        back.diffuseTexture = new BABYLON.Texture("img/card-back.png", this.sharedComponents.scene);

        // Creazione del piano
        const card = BABYLON.MeshBuilder.CreatePlane("card", { size: 5 }, this.sharedComponents.scene);

        // Applica il materiale 1 alla faccia 1
        card.material = front;

        // Ruota il piano di 180 gradi in modo che l'altro lato sia visibile
        card.rotation.x = Math.PI;

        const camera = this.sharedComponents.scene.activeCamera;
        // Applica il materiale 2 alla faccia 2
        card.onBeforeRenderObservable.add(function () {
            const worldMatrix = card.getWorldMatrix();
            const forward = new BABYLON.Vector3(0, 0, 1);
            const localForward = BABYLON.Vector3.TransformNormal(forward, worldMatrix);

            if (BABYLON.Vector3.Dot(camera.position.subtract(card.position), localForward) > 0) {
                card.material = back;
            } else {
                card.material = front;
            }
        });
    }
}

export { HandView };