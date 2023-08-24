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
        if (this.turn.phase === Phase.DrawPhase) {
            if (this.turn.isPlayer1Turn) {
                // this.publish(this.parent.playersInfo.p1.viewId, "yourTurn");
                // this.publish(this.parent.playersInfo.p2.viewId, "endTurn");
                this.publish(this.id, "changeTurn", {view: this.parent.playersInfo.p1.viewId});
            } else {
                // this.publish(this.parent.playersInfo.p2.viewId, "yourTurn");
                // this.publish(this.parent.playersInfo.p1.viewId, "endTurn");
                this.publish(this.id, "changeTurn", {view: this.parent.playersInfo.p2.viewId});
            }
        }
    }
}

TurnModel.register("TurnModel");

export { TurnModel };