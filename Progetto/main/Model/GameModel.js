import { TurnModel } from "./TurnModel.js";
import { Constants } from "../Utils/Constants.js";
import { PlayerModel } from "./PlayerModel.js";
import { BattleFieldModel } from "./BattleFieldModel.js";

class GameModel extends Croquet.Model {

    counter = 0;

    battleFieldModel = BattleFieldModel.create({parent: this});
    
    player1 = PlayerModel.create({parent: this, battleField: battleFieldModel});

    player2 = PlayerModel.create({parent: this, battleField: battleFieldModel});

    turnModel = TurnModel.create({parent: this});
    
    playersInfo = {
        p1: {
            viewId: "",
            isConnected: false,
        },
        p2: {
            viewId: "",
            isConnected: false,
        }
    };
    
    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.subscribe(this.id, "join", this.join);
        this.subscribe(this.sessionId, "view-exit", this.left);
        this.subscribe(this.player1.id, "gameOver", () => this.gameOver(this.player1.id));
        this.subscribe(this.player2.id, "gameOver", () => this.gameOver(this.player2.id));
        this.Log("Created - " + this.id);
    }

    join(viewId) {
        var role = "a Spectator";
        var action = viewId;
        if (this.playersInfo.p1.viewId === "") {
            this.playersInfo.p1.viewId = viewId;
            this.playersInfo.p1.isConnected = true;
            action += " joined the game as Player 1.";
            role = "Player 1";
        } else if (this.playersInfo.p2.viewId === "") {
            this.playersInfo.p2.viewId = viewId;
            this.playersInfo.p2.isConnected = true;
            action += " joined the game as Player 2.";
            role = "Player 2";
            this.publish(this.playersInfo.p1.viewId, "opponent-recover");
        } else if (this.playersInfo.p1.viewId === viewId) {
            this.playersInfo.p1.isConnected = true;
            action += " reconnected as Player 1.";
            role = "Player 1";
            this.publish(this.playersInfo.p2.viewId, "opponent-recover");
        } else if (this.playersInfo.p2.viewId === viewId) {
            this.playersInfo.p2.isConnected = true;
            action += " reconnected as Player 2.";
            role = "Player 2";
            this.publish(this.playersInfo.p1.viewId, "opponent-recover");
        } else {
            action += " joined the game as a Spectator.";
        }
        this.Log(action);
        this.publish(viewId, "join-response", role);
    }

    left(viewId) {
        if (this.playersInfo.p1.viewId === viewId) {
            this.playersInfo.p1.isConnected = false;
            this.Log("Player 1 left.");
            this.selfDestroy();
            this.publish(this.playersInfo.p2.viewId, "opponent-left");
        } else if (this.playersInfo.p2.viewId === viewId) {
            this.playersInfo.p2.isConnected = false;
            this.Log("Player 2 left.");
            this.selfDestroy();
            this.publish(this.playersInfo.p1.viewId, "opponent-left");
        }
    }

    selfDestroy() {
        if (!this.playersInfo.p1.isConnected || !this.playersInfo.p2.isConnected) {
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
        this.publish(this.id, "game-over", loser === this.player1.lifePoints.id ? "Player 2 win" : "Player 1 win");
        this.parentModel.destroyGameModel();
    }

    Log(string) {
        console.log("GAMEMODEL: " + string);
    }
}

GameModel.register("GameModel");

export { GameModel };