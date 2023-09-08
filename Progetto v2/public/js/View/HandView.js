import { BaseView } from "../BaseView.js";
import { Cards } from "../Utils/Constants.js";

class HandView extends BaseView {

    _initializeScene() {

        this.hand = [];

        this.model.hand.forEach(cardId => {
            this.spawnCard(cardId);
        });
    }

    spawnCard(cardId) { //TODO
        // const infos = Cards.find(function(card) {
        //     return card.id === cardId; 
        // });
        // const card = BABYLON.MeshBuilder.CreatePlane("card", { size: 1 }, this.sharedComponents.scene);
        // const material = new BABYLON.StandardMaterial("mat", this.sharedComponents.scene);
        // const front = new BABYLON.Texture(infos.image, this.sharedComponents.scene);
        // const back = new BABYLON.Texture("img/card-back.png", this.sharedComponents.scene);

        // material.diffuseTexture = front;
        // material.backFaceCulling = false;

        // card.material = material;

        // card.onBeforeRenderObservable.add(() => {
        //     if (this.sharedComponents.scene.activeCamera.isReady()) {
        //         material.diffuseTexture = this.sharedComponents.scene.activeCamera.position.z > card.position.z ? back : front;
        //     }
        // });
        // card.position.y = 1;

        // var standardWidth = 0.1; // Larghezza standard desiderata
        // var standardHeight = 0.2; // Altezza standard desiderata

        // // Cambia la scala del piano per adattarlo alle dimensioni standard
        // const bb = card.getBoundingInfo().boundingBox;
        // var originalWidth = bb.maximum.x - bb.minimum.x;
        // var originalHeight = bb.maximum.y - bb.minimum.y;
        // card.scaling = new BABYLON.Vector3(standardWidth / originalWidth, standardHeight / originalHeight, 1);
        // const behaviour = new BABYLON.FollowBehavior();
        // behaviour.followHeightOffset = 0.5;
        // behaviour.followLerpSpeed = 0.1;
        // behaviour.target = this.sharedComponents.camera;
        // behaviour.attach(card);
    }
}

export { HandView };