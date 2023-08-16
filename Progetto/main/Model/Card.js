import { Cards } from "../Utils/Constants.js"

class Card {
    constructor(id) {
        this.id = id;
        const thisCard = Cards.find(card => card.id === id);
        if (thisCard === undefined) throw new Error("Card not found");
        this.name = thisCard.name;
        this.type = thisCard.type;
        this.image = image;
        this.effect = thisCard.effect;
    }

    activateEffect() {
        console.log(this.name + " effect activated: " + this.effect);
    }
}

export { Card };