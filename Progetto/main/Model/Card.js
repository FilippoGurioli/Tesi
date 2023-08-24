import { Cards } from "../Utils/Constants.js"
import { CardType } from "./CardFeature.js";

class Card {
    constructor(id) {
        this.id = id;
        const cardIdentity = Cards.find(card => card.id === id);
        if (cardIdentity === undefined) throw new Error("Card not found");
        this.name = cardIdentity.name;
        if (cardIdentity.type === "monster") this.type = CardType.Monster;
        else if (cardIdentity.type === "spell") this.type = CardType.Spell;
        else if (cardIdentity.type === "trap") this.type = CardType.Trap;
        else throw new Error("Card type not found");
        this.effect = cardIdentity.effect;
        this.description = cardIdentity.description;
    }

    activateEffect() {
        console.log(this.name + " effect activated: " + this.effect);
    }
}

export { Card };