import { BaseView } from "../BaseView.js";
import { Cards } from "../Utils/Constants.js";

class HandView extends BaseView {

    _initializeScene() {
        this.delta = 0;
        this.hand = [];

        this.model.hand.forEach(cardId => {
            this.spawnCard({id: cardId});
        });
    }

    _subscribeAll() {
        this.subscribe(this.model.id, "removeCard", this.removeCard);
        this.subscribe(this.model.id, "addCard", this.spawnCard);
    }

    spawnCard(data) {
        const infos = Cards.find(card => card.id === data.id);
        const material = new BABYLON.StandardMaterial("mat", this.sharedComponents.scene);
        const front = new BABYLON.Texture(infos.image, this.sharedComponents.scene);
        const f = new BABYLON.Vector4(0,0,0.5,1);
        const b = new BABYLON.Vector4(0.5,0,1,1);
        material.diffuseTexture = front;
        const card = BABYLON.MeshBuilder.CreatePlane("card", {frontUVs: f, backUVs: b, size: 0.1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this.sharedComponents.scene);
        card.material = material;

        card.position = this.sharedComponents.camera.position.clone();
        if (card.position.z < 0) card.position.z += 0.4;
        else                     card.position.z -= 0.4;
        card.position.y -= 0.5;
        card.position.x += this.delta;
        this.delta += 0.1;
        card.lookAt(this.sharedComponents.camera.position);

        const behavior = new BABYLON.SixDofDragBehavior();
        behavior.dragDeltaRatio = 0.2;
        behavior.zDragFactor = 0.2;
        this.isFirstClick = true;
        behavior.onDragStartObservable.add(_=>{
            if (this.isFirstClick) {
                this.isFirstClick = false;
                setTimeout(() => {
                    this.isFirstClick = true;
                }, 200);
            } else { //double click case
                this.publish(this.model.id, "playCard", data);
            }
        });
        behavior.attach(card);
        this.hand.push(card);
        this.sceneObjects.push(card);
    }

    removeCard(data) {
        for (var card of this.hand) {
            if (card.material.diffuseTexture.url === Cards.find(c => c.id === data.id).image) {
                this.hand.splice(this.hand.indexOf(card),1);
                card.dispose();
                this.delta -= 0.1;
                break;
            }
        }
    }
}

export { HandView };