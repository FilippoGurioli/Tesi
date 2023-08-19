import { LifePointsModel } from "./LifePointsModel.js";
import { DeckModel } from "./DeckModel.js";
import { HandModel } from "./HandModel.js";

class PlayerModel extends Croquet.Model {
    
    lifePoints = LifePointsModel.create({parent: this});

    deck = DeckModel.create({parent: this});

    init({parent: parentModel, battleField: battleFieldModel}) {
        this.parentModel = parentModel;
        this.hand = HandModel.create({parent: this, battleField: battleFieldModel});
        this.Log("Created");
    }

    Log(string) {
        console.log("PLAYER | "+ this.id.substring(this.id.length - 2) + ": " + string);
    }
}

PlayerModel.register("PlayerModel");

export { PlayerModel };