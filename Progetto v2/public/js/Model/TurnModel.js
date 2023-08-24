import { BaseModel } from "../BaseModel.js";
import { Turn, Phase } from "../MyModels/Turn.js";


class TurnModel extends BaseModel {

    _initialize() {
        this.turn = new Turn();
    }

    _subscribeAll() {
        this.subscribe(this.id, "nextPhase", this.nextPhase);
    }

    nextPhase() {
        this.turn.nextPhase();
    }
}

TurnModel.register("TurnModel");

export { TurnModel };