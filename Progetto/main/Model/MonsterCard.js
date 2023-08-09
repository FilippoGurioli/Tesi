import { Card } from "./Card.js";

class MonsterCard extends Card {

    constructor(id, name, image, description, attribute, level, race, subtype, atk, def) {
        super(id, name, image, description);
        this.attribute = attribute;
        this.level = level;
        this.race = race;
        this.subtype = subtype;
        this.atk = atk;
        this.def = def;
    }

    attack(card) {
        if (card.position === CardPosition.ATK) {
            if (this.atk > card.atk) {
                console.log("Card " + card.name + " destroyed, opponent receive " + (this.atk - card.atk) + " damage");
            } else if (this.atk < card.atk) {
                console.log("Card " + this.name + " destroyed, you receive " + (card.atk - this.atk) + " damage");
            } else {
                console.log("Both cards destroyed");
            }
        } else {
            if (this.atk > card.def) {
                console.log("Card " + card.name + " destroyed");
            } else if (this.atk < card.def) {
                console.log("You receive " + (card.def - this.atk) + " damage");
            } else {
                console.log("Equal def, nothing happens");
            }
        }
    }
}