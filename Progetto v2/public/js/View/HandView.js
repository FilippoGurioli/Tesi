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
        const card = BABYLON.MeshBuilder.CreatePlane("card", { size: 1 }, this.sharedComponents.scene);
        const material = new BABYLON.StandardMaterial("mat", this.sharedComponents.scene);
        const front = new BABYLON.Texture(infos.image, this.sharedComponents.scene);
        const back = new BABYLON.Texture("img/card-back.png", this.sharedComponents.scene);

        material.diffuseTexture = front;
        material.backFaceCulling = false;

        card.material = material;

        card.onBeforeRenderObservable.add(() => {
            if (this.sharedComponents.scene.activeCamera.isReady()) {
                material.diffuseTexture = this.sharedComponents.scene.activeCamera.position.z > card.position.z ? back : front;
            }
        });
        card.position.y = 1;
    }
}

export { HandView };