import { Turn } from "./Turn.js";
import { Phase } from "./Phase.js";

class TurnModel extends Croquet.Model {

    turn = new Turn();

    init({parent: parentModel}) {
        this.Log("Created - " + this.id);

        this.parentModel = parentModel;
        this.subscribe(this.id, "nextPhase", this.nextPhase);
    }

    nextPhase() {
        this.turn.nextPhase();
        if (this.turn.phase === Phase.DrawPhase) {
            if (this.turn.isPlayer1Turn) {
                this.publish(this.parentModel.playersInfo.p1.viewId, "yourTurn");
                this.publish(this.parentModel.playersInfo.p2.viewId, "endTurn");
            } else {
                this.publish(this.parentModel.playersInfo.p2.viewId, "yourTurn");
                this.publish(this.parentModel.playersInfo.p1.viewId, "endTurn");
            }
        }
    }

    Log(string) {
        console.log("TURNMODEL: " + string);
    }
}

TurnModel.register("TurnModel");

export { TurnModel };