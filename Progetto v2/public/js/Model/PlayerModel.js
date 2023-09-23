import { BaseModel } from "../BaseModel.js";
import { LifePointsModel } from "./LifePointsModel.js";
import { HandModel } from "./HandModel.js";
import { DeckModel } from "./DeckModel.js";

class PlayerModel extends BaseModel {

    _initialize(data) {

        this.lifePoints = LifePointsModel.create({parent: this});
        this.hand = HandModel.create({parent: this, turnModel: data.turnModel, battleField: data.battleField, hand: [46986414, 46986414]});
        this.deck = DeckModel.create({parent: this, turnModel: data.turnModel, handModel: this.hand});
        this.role = data.role;
    }

    set opponent(opponent) {
        this.lifePoints.opponent = opponent.lifePoints;
    }
}

PlayerModel.register("PlayerModel");

export { PlayerModel };