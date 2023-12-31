import { BaseModel } from "../BaseModel.js";
import { Phase } from "../MyModels/Turn.js";
import { Cards } from "../Utils/Constants.js";

class HandModel extends BaseModel {
    
    #hand = [];

    summonTokenUsed = false;

    _initialize(data) {
        if (data.hasOwnProperty("hand")) {
            this.#hand = data.hand;
        } else {
            let i = 0;
            while (i++ < 5) {
                this.#hand.push(Cards[Math.floor(Math.random() * Cards.length)].id); //used Math.random instead of croquet random method on purpose to generate different cards to different users
            }
        }
        this.battleField = data.battleField;
        this.turnModel = data.turnModel;

        this.subscribe(this.turnModel.id, "nextPhase", this.reset);
    }

    reset() {
        if (this.turnModel.phase === Phase.EndPhase) {
            this.summonTokenUsed = false;
        }
    }

    _subscribeAll() {
        this.subscribe(this.id, "playCard", this.tryPlayCard);
    }

    get hand() {
        return this.#hand;
    }

    addCard(id) {
        this.#hand.push(id);
        this.publish(this.id, "addCard", {id: id});
    }

    tryPlayCard(data) {
        if ((this.turnModel.phase === Phase.MainPhase1 || this.turnModel.phase === Phase.MainPhase2) && 
            this.turnModel.isTurnOf(this.parent.role) && this.battleField.hasAvailableSlots(this.parent.role, data.id)) {
            if (Cards.find(c => c.id === data.id).type === "monster" && this.summonTokenUsed) return;
            else if (Cards.find(c => c.id === data.id).type === "monster" && !this.summonTokenUsed)   this.summonTokenUsed = true;
            this.battleField.place(this.parent.role, data.id);
            this.#hand.splice(this.#hand.indexOf(data.id), 1);
            this.publish(this.id, "removeCard", data);
        }
    }
}

HandModel.register("HandModel");

export { HandModel };