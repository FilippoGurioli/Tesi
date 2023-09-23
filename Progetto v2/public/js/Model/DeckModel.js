import { BaseModel } from "../BaseModel.js";
import { Phase } from "../MyModels/Turn.js";
import { Cards } from "../Utils/Constants.js";

class DeckModel extends BaseModel {
    
    #deck = [];
    
    _initialize(data) {
        this.hasDrew = false;
        if (data.hasOwnProperty("deck")) {
            this.#deck = data.deck;
        } else {
            let i = 0;
            while (i++ < 10) {
                this.#deck.push(Cards[Math.floor(Math.random() * Cards.length)].id);
            }
        }
        this.turnModel = data.turnModel;
        this.handModel = data.handModel;
        this.subscribe(this.turnModel.id, "nextPhase", () => this.hasDrew = false); //! TMP
    }

    _subscribeAll() {
        this.subscribe(this.id, "drawCard", this.tryDrawCard);
    }

    tryDrawCard() {
        if (this.#deck.length != 0 && this.turnModel.phase === Phase.DrawPhase && this.turnModel.isTurnOf(this.parent.role) && !this.hasDrew) {
            this.hasDrew = true;
            this.handModel.addCard(this.#deck.shift());
            if (this.#deck.length === 0)    this.publish(this.id, "emptyDeck");
        }
    }
}

DeckModel.register("DeckModel");

export { DeckModel };