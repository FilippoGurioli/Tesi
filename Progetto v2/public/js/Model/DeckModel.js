import { BaseModel } from "../BaseModel.js";
import { Phase } from "../MyModels/Turn.js";
import { Cards } from "../Utils/Constants.js";

class DeckModel extends BaseModel {
    
    #deck = [];
    #hasDrew = false;

    _initialize(data) {
        if (data.hasOwnProperty("deck")) {
            this.#deck = data.deck;
        } else {
            let i = 0;
            while (i++ < 10) {
                this.#deck.push(Cards[Math.floor(Math.random() * Cards.length)].id);
            }
        }
        console.log(this.#deck);
        this.turnModel = data.turnModel;
        this.handModel = data.handModel;
    }

    _subscribeAll() {
        this.subscribe(this.id, "drawCard", this.tryDrawCard);
        this.subscribe(this.turnModel.id, "nextPhase", () => this.#hasDrew = false);
    }

    tryDrawCard() {
        if (this.turnModel.phase === Phase.DrawPhase && this.turnModel.isTurnOf(this.parent.role) && !this.#hasDrew) {
            this.#hasDrew = true;
            this.handModel.addCard(this.#deck.shift());
            if (this.#deck.length === 0)    this.publish(this.id, "emptyDeck");
        } else {
            this._log("NON SI PUO PESCARE ORA LA CARTA");
        }
    }

    get hasDrew() {
        return this.#hasDrew;
    }
}

DeckModel.register("DeckModel");

export { DeckModel };