import { Card } from "./Card.js";

class CardModel extends Croquet.Model {

    init({parent: parentModel, cardId: cardId}) {
        this.parentModel = parentModel;
        this.card = new Card(cardId);
        this.Log("Created");
    }

    Log(message) {
        console.log("CARDMODEL | " + this.id.substring(this.id.length - 2) + ": " + message);
    }
}

export { CardModel };