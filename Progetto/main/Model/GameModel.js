import { TurnModel } from "./TurnModel.js";
import { Constants } from "../Utils/Constants.js";
import { LifePointsModel } from "./LifePointsModel.js";
import { BattleFieldModel } from "./BattleFieldModel.js";

class GameModel extends Croquet.Model {

    counter = 0;
    
    players = {
        p1: {
            viewId: "",
            isConnected: false,
            lifePoints: LifePointsModel.create({parent: this}),
            deck: [],
        },
        p2: {
            viewId: "",
            isConnected: false,
            lifePoints: LifePointsModel.create({parent: this}),
            deck: [],
        }
    };
    
    turnModel = TurnModel.create({parent: this});
    battleFieldModel = BattleFieldModel.create({parent: this});
    
    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.subscribe(this.id, "join", this.join);
        this.subscribe(this.sessionId, "view-exit", this.left);
        this.Log("Created - " + this.id);
    }

    join(viewId) {
        var role = "a Spectator";
        var action = viewId;
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
        } else {
            action += " joined the game as a Spectator.";
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

    gameOver(loser) {
        this.publish(this.id, "game-over", loser === this.players.p1.lifePoints.id ? "Player 2 win" : "Player 1 win");
        this.parentModel.destroyGameModel();
    }

    Log(string) {
        console.log("GAMEMODEL: " + string);
    }
}

GameModel.register("GameModel");

export { GameModel };