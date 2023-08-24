import { LifePointsModel } from "./LifePointsModel.js";
import { DeckModel } from "./DeckModel.js";
import { HandModel } from "./HandModel.js";
import { CardModel } from "./CardModel.js";

class PlayerModel extends Croquet.Model {
    
    lifePoints = LifePointsModel.create({parent: this});

    deck = DeckModel.create({parent: this});

    init({parent: parentModel, battleField: battleFieldModel}) {
        this.parentModel = parentModel;
        this.hand = HandModel.create({parent: this, battleField: battleFieldModel});


        this.deck.addCardOnTop(CardModel.create({parent: this, cardId: 83968380}));
        this.Log("Created");
    }

    Log(string) {
        console.log("PLAYER | "+ this.id.substring(this.id.length - 2) + ": " + string);
    }
}

PlayerModel.register("PlayerModel");

export { PlayerModel };