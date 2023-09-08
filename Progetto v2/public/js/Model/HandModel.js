import { BaseModel } from "../BaseModel.js";
import { Phase } from "../MyModels/Turn.js";

class HandModel extends BaseModel {
    
    #hand = [];

    _initialize(data) {
        this.battleField = data.battleField;
        this.#hand = data.hand;
        this.turnModel = data.turnModel;
        
    }

    _subscribeAll() {
        this.subscribe(this.id, "play card", this.tryPlayCard);
    }

    get hand() {
        return this.#hand;
    }

    tryPlayCard(data) {
        if ((this.turnModel.phase === Phase.MainPhase1 || this.turnModel.phase === Phase.MainPhase2) && this.turnModel.isTurnOf(this.parent.role)) {
            this.publish(this.parent.id, "place card", data);
        } else {
            this._log("NON SI PUò GIOCARE ORA LA CARTA");
        }
    }
}

HandModel.register("HandModel");

export { HandModel };