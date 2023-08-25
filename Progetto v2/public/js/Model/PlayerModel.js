import { BaseModel } from "../BaseModel.js";
import { LifePointsModel } from "./LifePointsModel.js";

class PlayerModel extends BaseModel {

    #opponent = null;

    _initialize(data) {

        this.lifePoints = LifePointsModel.create({parent: this});

        this.battleField = data.battleField;
        //this.handModel = HandModel.create({parent: this});
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