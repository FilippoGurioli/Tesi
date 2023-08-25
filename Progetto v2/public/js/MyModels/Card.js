import { Cards } from "../Utils/Constants.js";
import { CardType } from "./CardFeatures.js";

class Card {
    constructor(id) {
        this.id = id;
        const cardIdentity = Cards.find(card => card.id === id);
        if (cardIdentity === undefined) throw new Error("Card not found");
        this.name = cardIdentity.name;
        if (cardIdentity.type === "monster") this.type = CardType.Monster;
        else if (cardIdentity.type === "spell") this.type = CardType.Spell;
        else if (cardIdentity.type === "trap") this.type = CardType.Trap;
        else throw new Error("Incorrect card type");
        //this.effect = cardIdentity.effect; //TODO: ipoteticamente l'effetto sarà un insieme di comandi
        this.description = cardIdentity.description;
    }
}

export { Card };