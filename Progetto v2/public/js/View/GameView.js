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
    }
    
    _initialize() {
        this.publish(this.model.id, "join", {view: this.viewId});
    }

    _update() {

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
        this.sharedComponents.xrHelper.baseExperience.camera.setTransformationFromNonVRCamera(this.sharedComponents.camera);
        this.#gameStart();
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