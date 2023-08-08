import { Turn } from "./Turn.js";
import { Phase } from "./Phase.js";

class TurnModel extends Croquet.Model {

    turn = new Turn();

    init({parent: parentModel}) {
        this.Log(this.id + " created.");

        this.parentModel = parentModel;
        this.subscribe(this.id, "nextPhase", this.nextPhase);
    }

    nextPhase() {
        this.turn.nextPhase();
        this.Log(this.turn);
        if (this.turn.phase === Phase.DrawPhase) {
            this.publish(this.id, "changeTurn");
        }
    }

    Log(string) {
        console.log("TURNMODEL: " + string);
    }
}

TurnModel.register("TurnModel");

export { TurnModel };