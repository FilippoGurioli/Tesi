import { TurnModel } from "./TurnModel.js";
import { LifePointsModel } from "./LifePointsModel.js";
import { Constants } from "../Utils/Constants.js";

class GameModel extends Croquet.Model {

    counter = 0;

    players = {
        p1: {
            viewId: "",
            isConnected: false,
            lifePoints: LifePointsModel.create({parent: this})
        },
        p2: {
            viewId: "",
            isConnected: false,
            lifePoints: LifePointsModel.create({parent: this})
        }
    }; //più avanti saranno Croquet.Model

    turnModel = TurnModel.create({parent: this});

    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.Log(this.id + " created.");
        this.subscribe(this.id, "join", this.join);
        this.subscribe(this.sessionId, "view-exit", this.left);
    }

    join(viewId) {
        var action = viewId;
        var role = "a Spectator";
        if (this.players.p1.viewId === "") {
            this.players.p1.viewId = viewId;
            this.players.p1.isConnected = true;
            action += " joined the game as Player 1.";
            role = "Player 1";
        } else if (this.players.p2.viewId === "") {
            this.players.p2.viewId = viewId;
            this.players.p2.isConnected = true;
            action += " joined the game as Player 2.";
            role = "Player 2";
            this.publish(this.players.p1.viewId, "opponent-recover");
        } else if (this.players.p1.viewId === viewId) {
            this.players.p1.isConnected = true;
            action += " reconnected as Player 1.";
            role = "Player 1";
            this.publish(this.players.p2.viewId, "opponent-recover");
        } else if (this.players.p2.viewId === viewId) {
            this.players.p2.isConnected = true;
            action += " reconnected as Player 2.";
            role = "Player 2";
            this.publish(this.players.p1.viewId, "opponent-recover");
        }
        this.Log(action);
        this.publish(viewId, "join-response", role);
    }

    left(viewId) {
        if (this.players.p1.viewId === viewId) {
            this.players.p1.isConnected = false;
            this.Log("Player 1 left.");
            this.selfDestroy();
            this.publish(this.players.p2.viewId, "opponent-left");
        } else if (this.players.p2.viewId === viewId) {
            this.players.p2.isConnected = false;
            this.Log("Player 2 left.");
            this.selfDestroy();
            this.publish(this.players.p1.viewId, "opponent-left");
        }
    }

    selfDestroy() {
        if (!this.players.p1.isConnected || !this.players.p2.isConnected) {
            this.counter++;
            if (this.counter >= Constants.DISC_TIME_LIMIT) {
                this.publish(this.id, "game-over", "Player disconnected");
                this.parentModel.destroyGameModel();
            } else {
                this.Log("Waiting for reconnection...");
                this.future(1000).selfDestroy();
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