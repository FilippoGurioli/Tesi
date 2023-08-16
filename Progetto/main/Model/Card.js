import { CardPosition } from "./CardFeature.js";

class Card {
    constructor(id) {
        this.id = id;
    }

    activateEffect() {
        console.log("Card " + this.name + " effect activated: " + this.description);
    }
}

export { Card };