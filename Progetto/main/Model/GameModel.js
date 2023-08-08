import { TurnModel } from "./TurnModel.js";

class GameModel extends Croquet.Model {

    counter = 0;

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
            this.selfDestroy("Player 1");
        } else if (this.players.p2.viewId === viewId) {
            this.players.p2.isConnected = false;
            this.Log("Player 2 left.");
            this.selfDestroy("player 2");
        }
    }

    selfDestroy(who) {
        this.publish(this.id, "broadcastText", who + " disconnected.");
        this.destroyAlgorithm();
    }

    destroyAlgorithm() {
        if (!this.players.p1.isConnected || !this.players.p2.isConnected) {
            this.counter++;
            if (this.counter >= 30) {
                this.Log(this.id + " destroyed.");
                this.parentModel.destroyGameModel();
            } else {
                this.Log("Waiting for reconnection...");
                this.future(1000).destroyAlgorithm();
            }
        } else {
            this.counter = 0;
        }
    }

    Log(string) {
        console.log("GAMEMODEL: " + string);
    }
}

GameModel.register("GameModel");

export { GameModel };