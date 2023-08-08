import { Turn } from "./Model/Turn.js";
import { Phase } from "./Model/Phase.js";

class RootModel extends Croquet.Model {

    gameModel = null;

    connectedViews = [];

    /**
    * Initialize the Model.
    * */
    init() {
        this.Log(this.id + " created.");

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId) {
        this.connectedViews.push(viewId);
        this.Log("view " + viewId + " joined.");

        if (this.gameModel === null) {
            this.gameModel = GameModel.create({parent: this});
        }
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId) {
        this.connectedViews = this.connectedViews.splice(this.connectedViews.indexOf(viewId), 1);
        this.Log("view " + viewId + " left.");
        if(this.connectedViews.length === 0) {
            this.destroy();
        }
    }

    Log(string) {
        console.log("MODEL: " + string);
    }
}

RootModel.register("RootModel");

class GameModel extends Croquet.Model {

    players = {p1: {viewId: "", isConnected: false}, p2: {viewId: "", isConnected: false}}; //più avanti saranno Croquet.Model

    turnModel = TurnModel.create({parent: this});

    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.Log(this.id + " created.");
        this.subscribe(this.sessionId, "view-join", this.join);
        this.subscribe(this.sessionId, "view-exit", this.left); //mi piacerebbe un giorno uniformarla a viewJoin (o il contrario)
    }

    join(viewId) {
        if (this.players.p1.viewId === "") {
            this.players.p1.viewId = viewId;
            this.players.p1.isConnected = true;
            this.Log("view " + viewId + " joined as Player 1.");
        } else if (this.players.p2.viewId === "") {
            this.players.p2.viewId = viewId;
            this.players.p2.isConnected = true;
            this.Log("view " + viewId + " joined as Player 2.");
        } else if (this.players.p1.viewId === viewId) {
            this.players.p1.isConnected = true;
            this.Log("view " + viewId + " reconnected as Player 1.");
        } else if (this.players.p2.viewId === viewId) {
            this.players.p2.isConnected = true;
            this.Log("view " + viewId + " reconnected as Player 2.");
        }
    }

    left(viewId) {
        if (this.players.p1.viewId === viewId) {
            this.players.p1.isConnected = false;
            this.Log("Player 1 left.");
            this.future(1000).selfDestroy();
        } else if (this.players.p2.viewId === viewId) {
            this.players.p2.isConnected = false;
            this.Log("Player 2 left.");
            this.future(1000).selfDestroy();
        }
    }

    selfDestroy() {
        this.counter++;
        if (this.counter === 30) {
            this.destroy();
        }
        if (this.players.p1.isConnected === false || this.players.p2.isConnected === false) {
            this.future(1000).selfDestroy();
        }
        else {
            this.counter = 0;
        }
    }

    Log(string) {
        console.log("GAMEMODEL: " + string);
    }
}

GameModel.register("GameModel");

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
            this.publish(this.id, "changeTurn", this.turn.turn % 2 === 0 ? this.parentModel.players.p2.viewId : this.parentModel.players.p1.viewId);
        }
    }

    Log(string) {
        console.log("TURNMODEL: " + string);
    }
}

TurnModel.register("TurnModel");

export { RootModel };