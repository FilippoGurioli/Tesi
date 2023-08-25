import { BaseView } from "../BaseView.js";
import { Constants } from "../Utils/Constants.js";
import { TurnView } from "./TurnView.js";
import { BattleFieldView } from "./BattleFieldView.js";
import { PlayerView } from "./PlayerView.js";

class GameView extends BaseView {
    
    #opponentRecovered = false;

    #role = "";

    counter = 0;
    
    _subscribeAll() {
        this.subscribe(this.viewId, "join-response", this.setPosition);
        this.subscribe(this.viewId, "opponent-left", () => this.wait("Opponent disconnected...", "Opponent reconnected!"));
        this.subscribe(this.viewId, "opponent-recover", () => this.#opponentRecovered = true);
        this.subscribe(this.model.id, "disconnection", () => this.gameOver("Player disconnected"));
    }
    
    _initialize() {
        this.publish(this.model.id, "join", {view: this.viewId});
    }

    setPosition(data) {
        this.#role = data.role;
        if (data.role === "Player 1") {
            this.sharedComponents.camera.position = Constants.P1_POS;
        } else if (data.role === "Player 2") {
            this.sharedComponents.camera.position = Constants.P2_POS;
        } else {
            this.sharedComponents.camera.position = Constants.SPEC_POS;
        }
        this.sharedComponents.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        this.sharedComponents.xrCamera.setTransformationFromNonVRCamera(this.sharedComponents.camera);
        this.#gameStart();
        if (!this.model.playersInfo.p2.isConnected) {
            this.wait("Waiting for Player 2...", "");
        }
    }

    wait(reason, finalSentence) {
        this.turnView.displaySpecialMessage(reason);
        this.waiting(finalSentence);
    }

    waiting(finalSentence) {
        if (this.#opponentRecovered) {
            this.#opponentRecovered = false;
            this.turnView.resume();
            return;
        } else if (this.emergencyExit) {
            this.emergencyExit = false;
            return;
        }
        this.future(500).waiting(finalSentence);
    }

    gameOver(data) {
        this.emergencyExit = true; //exit from waiting
        this.turnView.displaySpecialMessage("Game Over\n" + data.reason);
        this.endScene();
    }

    endScene() {
        //this.BFView.plane.visibility -= 0.01;
        //if (this.BFView.plane.visibility > 0) this.future(100).endScene();
        this.counter++;
        if (this.counter < 60) this.future(100).endScene();
        else {
            this.publish(this.viewId, "reload"); //reload the first scene
            this.detach();
        }
    }

    #gameStart() {
        this.turnView = new TurnView({model: this.model.turnModel, parent: this, role: this.#role});
        this.BFView = new BattleFieldView({model: this.model.battleFieldModel, parent: this});
        this.children.push(this.turnView, this.BFView);
        if (this.viewId === this.model.playersInfo.p1.viewId) {
            this.playerView = new PlayerView({model: this.model.player1, parent: this});
            this.children.push(this.playerView);
        } else if (this.viewId === this.model.playersInfo.p2.viewId) {
            this.playerView = new PlayerView({model: this.model.player2, parent: this});
            this.children.push(this.playerView);
        }
    }

}

export { GameView };