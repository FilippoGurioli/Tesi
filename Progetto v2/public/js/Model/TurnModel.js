import { BaseModel } from "../BaseModel.js";
import { Turn, Phase } from "../MyModels/Turn.js";


class TurnModel extends BaseModel {

    #turn = new Turn();

    _subscribeAll() {
        this.subscribe(this.id, "nextPhase", this.nextPhase);
    }

    nextPhase() {
        this._log("next phase");
        this.#turn.nextPhase();
    }

    get phase() {
        return this.#turn.phase;
    }

    get turn() {
        return this.#turn.turn;
    }

    get isPlayer1Turn() {
        return this.#turn.isPlayer1Turn;
    }
}

TurnModel.register("TurnModel");

export { TurnModel };