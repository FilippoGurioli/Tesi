import { BaseModel } from "../BaseModel.js";
import { Turn } from "../MyModels/Turn.js";


class TurnModel extends BaseModel {

    #turn = new Turn();

    _subscribeAll() {
        this.subscribe(this.id, "nextPhase", this.nextPhase);
    }

    nextPhase() {
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

    isTurnOf(role) {
        return role === 1 && this.#turn.isPlayer1Turn || role === 2 && !this.#turn.isPlayer1Turn;
    }
}

TurnModel.register("TurnModel");

export { TurnModel };