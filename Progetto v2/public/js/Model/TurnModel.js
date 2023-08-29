import { BaseModel } from "../BaseModel.js";
import { Turn, Phase } from "../MyModels/Turn.js";


class TurnModel extends BaseModel {

    #turn = new Turn();

    _subscribeAll() {
        this.subscribe(this.id, "nextPhase", this.nextPhase);
        this.subscribe(this.sessionId, "game-over", () => console.log("GAME OVER RECEIVED BY TURN MODEL"));
        this.test();
    }

    test() {
        this._log("test");
        this.future(1000).test();
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
}

TurnModel.register("TurnModel");

export { TurnModel };