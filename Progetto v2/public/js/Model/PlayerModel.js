import { BaseModel } from "../BaseModel.js";
import { LifePointsModel } from "./LifePointsModel.js";
import { HandModel } from "./HandModel.js";

class PlayerModel extends BaseModel {

    #opponent = null;

    _initialize(data) {

        this.lifePoints = LifePointsModel.create({parent: this});

        this.hand = HandModel.create({parent: this, battleField: data.battleField, hand: [46986414]});
        //this.deck.addCardOnTop(CardModel.create({parent: this, cardId: 83968380}));
    }

    gameOver() {
        this.publish(this.id, "gameOver", {reason: "You lost!"});
        this.publish(this.#opponent.id, "gameOver", {reason: "You won!"});
    }

    set opponent(opponent) {
        this.#opponent = opponent;
    }

    get opponent() {
        return this.#opponent;
    }
}

PlayerModel.register("PlayerModel");

export { PlayerModel };