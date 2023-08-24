import { BaseModel } from "../BaseModel.js";
import { Constants } from "../Utils/Constants.js";

class GameModel extends BaseModel {
    
    #counter = 0;

    _initialize() {

        this.playersInfo = {
            p1: {
                viewId: "",
                isConnected: false,
            },
            p2: {
                viewId: "",
                isConnected: false,
            }
        }

        // this.player1 = PlayerModel.create({parent: this, battleField: this.battleFieldModel});
        // this.player2 = PlayerModel.create({parent: this, battleField: this.battleFieldModel});
    }

    _subscribeAll() {
        this.subscribe(this.id, "join", this.join); //joining the game (different from simply joining the session)
        this.subscribe(this.sessionId, "view-exit", this.left); //lefting the game (coincide with lefting the session)
        // this.subscribe(this.player1.id, "gameOver", () => this.gameOver(this.player1.id));
        // this.subscribe(this.player2.id, "gameOver", () => this.gameOver(this.player2.id));
    }

    join(data) {
        let role = "a Spectator";
        let action = data.view;
        if (this.playersInfo.p1.viewId === "") {
            this.playersInfo.p1.viewId = data.view;
            this.playersInfo.p1.isConnected = true;
            action += " joined the game as Player 1.";
            role = "Player 1";
        } else if (this.playersInfo.p2.viewId === "") {
            this.playersInfo.p2.viewId = data.view;
            this.playersInfo.p2.isConnected = true;
            action += " joined the game as Player 2.";
            role = "Player 2";
            this.publish(this.playersInfo.p1.viewId, "opponent-recover");
        } else if (this.playersInfo.p1.viewId === data.view) {
            this.playersInfo.p1.isConnected = true;
            action += " reconnected as Player 1.";
            role = "Player 1";
            this.publish(this.playersInfo.p2.viewId, "opponent-recover");
        } else if (this.playersInfo.p2.viewId === data.view) {
            this.playersInfo.p2.isConnected = true;
            action += " reconnected as Player 2.";
            role = "Player 2";
            this.publish(this.playersInfo.p1.viewId, "opponent-recover");
        } else {
            action += " joined the game as a Spectator.";
        }
        this._log(action);
        this.publish(data.view, "join-response", {role: role});
    }

    left(viewId) {
        if (this.playersInfo.p1.viewId === viewId) {
            this.playersInfo.p1.isConnected = false;
            this._log("Player 1 left.");
            this.selfDestroy();
            this.publish(this.playersInfo.p2.viewId, "opponent-left");
        } else if (this.playersInfo.p2.viewId === viewId) {
            this.playersInfo.p2.isConnected = false;
            this._log("Player 2 left.");
            this.selfDestroy();
            this.publish(this.playersInfo.p1.viewId, "opponent-left");
        }
    }

    selfDestroy() {
        if (!this.playersInfo.p1.isConnected || !this.playersInfo.p2.isConnected) {
            this.#counter++;
            if (this.#counter >= Constants.DISC_TIME_LIMIT) {
                this.publish(this.id, "game-over", "Player disconnected");
                this.parent.destroyGameModel();
            } else {
                this._log("Waiting for reconnection...");
                this.future(1000).selfDestroy();
            }
        } else {
            this.#counter = 0;
        }
    }

    gameOver(loser) {
        this.publish(this.id, "game-over", loser === this.player1.lifePoints.id ? "Player 2 win" : "Player 1 win");
    }

}

GameModel.register("GameModel");

export { GameModel };