import { BaseModel } from "../BaseModel.js";
import { Constants } from "../Utils/Constants.js";
import { TurnModel } from "./TurnModel.js";
import { BattleFieldModel } from "./BattleFieldModel.js";
import { PlayerModel } from "./PlayerModel.js";

class GameModel extends BaseModel {
    
    #counter = 0;
    
    _initialize() {

        this.turnModel = TurnModel.create({parent: this});
        this.battleFieldModel = BattleFieldModel.create({parent: this, turnModel: this.turnModel});
        this.player1 = PlayerModel.create({parent: this, battleField: this.battleFieldModel, turnModel: this.turnModel, role: 1});
        this.player2 = PlayerModel.create({parent: this, battleField: this.battleFieldModel, turnModel: this.turnModel, role: 2});
        this.player1.opponent = this.player2;
        this.player2.opponent = this.player1;
        this.battleFieldModel.lifePointsModel = {p1: this.player1.lifePoints, p2: this.player2.lifePoints};
    }

    _subscribeAll() {
        this.subscribe(this.id, "join", this.join); //joining the game (different from simply joining the session)
        this.subscribe(this.sessionId, "view-exit", this.left); //lefting the game (coincide with lefting the session)
    }

    join(data) {
        let role = "a Spectator";
        let action = data.view;
        if (this.player1.view === "") {
            this.player1.view = data.view;
            this.player1.isConnected = true;
            action += " joined the game as Player 1.";
            role = "Player 1";
        } else if (this.player2.view === "") {
            this.player2.view = data.view;
            this.player2.isConnected = true;
            action += " joined the game as Player 2.";
            role = "Player 2";
            this.publish(this.player1.view, "opponent-recover");
        } else if (this.player1.viewId === data.view) {
            this.player1.isConnected = true;
            action += " reconnected as Player 1.";
            role = "Player 1";
            this.publish(this.player2.view, "opponent-recover");
        } else if (this.player2.view === data.view) {
            this.player2.isConnected = true;
            action += " reconnected as Player 2.";
            role = "Player 2";
            this.publish(this.player1.view, "opponent-recover");
        } else {
            action += " joined the game as a Spectator.";
        }
        this._log(action);
        this.publish(data.view, "join-response", {role: role});
    }

    left(viewId) {
        if (this.player1.view === viewId) {
            this.player1.isConnected = false;
            this._log("Player 1 left.");
            this.selfDestroy();
            this.publish(this.player2.view, "opponent-left");
        } else if (this.player2view === viewId) {
            this.player2.isConnected = false;
            this._log("Player 2 left.");
            this.selfDestroy();
            this.publish(this.player1.view, "opponent-left");
        }
    }

    selfDestroy() {
        if (!this.player1.isConnected || !this.player2.isConnected) {
            this.#counter++;
            if (this.#counter >= Constants.DISC_TIME_LIMIT) {
                this.publish(this.sessionId, "game-over", {winner: this.player1.isConnected ? this.player1.view : this.player2.viewId});
            } else {
                this._log("Waiting for reconnection...");
                this.future(1000).selfDestroy();
            }
        } else {
            this.#counter = 0;
        }
    }

}

GameModel.register("GameModel");

export { GameModel };