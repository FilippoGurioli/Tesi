class HandView extends BaseView {
    _initializeScene() {
        this.hand = [];
        this.model.hand.forEach(cardId => {
            this.spawnCard(cardId);
        });
    }
    _subscribeAll() {
        this.subscribe(this.model.id, "removeCard", (data) => this.hand.forEach(card => {
            if (card.material.diffuseTexture.url === Cards.find(c => c.id === data.id).image) {
                this.hand.splice(this.hand.indexOf(card),1);
                card.dispose();
                return;
            }
        }));
    }
    spawnCard(cardId) {
        const card = BABYLON.MeshBuilder.CreatePlane("card", {size: 0.1}, this.sharedComponents.scene);
        const behavior = new BABYLON.SixDofDragBehavior();
        behavior.onDragStartObservable.add(() => this.publish(this.model.id, "playCard", {id: cardId}));
        behavior.attach(card);
        this.hand.push(card);
        this.sceneObjects.push(card);
    }
}

class HandModel extends BaseModel {
    #hand = [];
    _initialize(data) {
        this.battleField = data.battleField;
        this.#hand = data.hand;
        this.turnModel = data.turnModel;
    }
    _subscribeAll() {
        this.subscribe(this.id, "playCard", this.tryPlayCard);
    }
    get hand() {
        return this.#hand;
    }
    tryPlayCard(data) {
        if ((this.turnModel.phase === Phase.MainPhase1 || this.turnModel.phase === Phase.MainPhase2) && this.turnModel.isTurnOf(this.parent.role)) {
            this.battleField.place(this.parent.role, data.id);
            this.#hand.splice(this.#hand.indexOf(data.id), 1);
            this.publish(this.id, "removeCard", data);
        }
    }
}

class BattleFieldModel extends BaseModel {
    #battleField = new BattleField();
    place(player, cardId) {
        const p = this.#battleField.place(Cards.find(c => c.id === cardId), player === 1);
        this.publish(this.id, "placeCard", {
            player: player,
            position: p,
            id: cardId
        });
    }
}