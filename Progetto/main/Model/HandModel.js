class HandModel extends Croquet.Model {

    hand = [];

    init({parent: parentModel, battleField: battleFieldModel}) {
        this.parentModel = parentModel;
        this.BFModel = battleFieldModel;
        this.Log("Created");
    }

    addCard(card) {
        this.hand.push(card);
        Log("Added card " + card);
    }

    playCard(card) {
        battleFieldModel.place(card);
        this.hand.splice(this.hand.indexOf(card), 1);
        Log("Played card " + card);
    }

    Log(string) {
        console.log(`HANDMODEL | ${this.id.substring(this.id.length - 2)}: ${string}`);
    }
}

HandModel.register("HandModel");

export { HandModel };