import { BaseView } from "../BaseView.js";
import { Cards } from "../Utils/Constants.js";

class HandView extends BaseView {

    _initializeScene() {

        this.hand = [];

        this.model.hand.forEach(cardId => {
            this.spawnCard(cardId);
        });
    }

    _subscribeAll() {
        this.subscribe(this.parent.model.id, "place card", (data) => this.hand.forEach(card => {
            if (card.material.diffuseTexture.url === Cards.find(c => c.id === data.id).image) {
                this.hand.splice(this.hand.indexOf(card),1);
                card.dispose();
                return;
            }
        }));
    }

    spawnCard(cardId) {
        const infos = Cards.find(function(card) {
            return card.id === cardId; 
        });
        const card = BABYLON.MeshBuilder.CreatePlane("card", {size: 0.1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this.sharedComponents.scene);  //TODO
        const material = new BABYLON.StandardMaterial("mat", this.sharedComponents.scene);
        const front = new BABYLON.Texture(infos.image, this.sharedComponents.scene);
        material.diffuseTexture = front;

        card.material = material;
        const behaviour = new BABYLON.FollowBehavior();
        behaviour.followHeightOffset = 0.5;
        behaviour.followLerpSpeed = 0.1;
        behaviour.target = this.sharedComponents.camera;
        behaviour.attach(card);

        const pointerDragBehavior = new BABYLON.PointerDragBehavior();
        pointerDragBehavior.useObjectOrientationForDragging = false;
        this.isFirstClick = true;
        pointerDragBehavior.onDragStartObservable.add((event)=>{
            if (this.isFirstClick) {
                this.isFirstClick = false;
                setTimeout(() => {
                    this.isFirstClick = true;
                }, 200);
            } else { //double click case
                this.publish(this.model.id, "play card", {id: cardId});
            }
        });
        pointerDragBehavior.attach(card);
        this.hand.push(card);
        this.sceneObjects.push(card);


        //________________________________________________________________________________________________
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