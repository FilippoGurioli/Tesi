import { BaseModel } from "../BaseModel.js";
import { LifePointsModel } from "./LifePointsModel.js";
import { HandModel } from "./HandModel.js";

class PlayerModel extends BaseModel {

    _initialize(data) {

        this.lifePoints = LifePointsModel.create({parent: this});

        this.hand = HandModel.create({parent: this, battleField: data.battleField, hand: [83968380]});
        //this.deck.addCardOnTop(CardModel.create({parent: this, cardId: 83968380}));
    }

    set opponent(opponent) {
        this.lifePoints.opponent = opponent.lifePoints;
    }
}

PlayerModel.register("PlayerModel");

export { PlayerModel };