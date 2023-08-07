import { Turn } from "./Model/Turn.js";
import { Phase } from "./Model/Phase.js";

class RootModel extends Croquet.Model {

    players = {p1: "", p2: ""};

    turnModel = TurnModel.create({parent: this});

    connectedViews = [];

    /**
    * Initialize the Model.
    * */
    init() {
        this.Log(this.id + " created.");

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);
        //this.subscribe("nextPhase", "clicked", this.nextPhase);
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId) {
        this.connectedViews.push(viewId);
        this.Log("view " + viewId + " joined.");
        if (this.players.p1 === "") {
            this.players.p1 = viewId;
        } else if (this.players.p2 === "") {
            this.players.p2 = viewId;
        }
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId) {
        this.connectedViews = this.connectedViews.splice(this.connectedViews.indexOf(viewId), 1);
        this.Log("view " + viewId + " left.");
        if (this.players.p1 === viewId) {
            this.players.p1 = "";
        } else if (this.players.p2 === viewId) {
            this.players.p2 = "";
        }
        if(this.connectedViews.length === 0) {
            this.destroy();
        }
    }

    // nextPhase() {
    //     this.turn.nextPhase();
    //     this.Log("TURN: " + this.turn);
    //     if (this.turn.phase === Phase.DrawPhase) {
    //         this.publish(this.id, "changeTurn", this.turn.turn % 2 === 0 ? this.players.p2 : this.players.p1);
    //     }
    // }


    Log(string) {
        console.log("MODEL: " + string);
    }
}

RootModel.register("RootModel");

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
            this.publish(this.id, "changeTurn", this.turn.turn % 2 === 0 ? this.parentModel.players.p2 : this.parentModel.players.p1);
        }
    }

    Log(string) {
        console.log("TURNMODEL: " + string);
    }

}

TurnModel.register("TurnModel");


export { RootModel };