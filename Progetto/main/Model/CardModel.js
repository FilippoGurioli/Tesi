import { Card } from "./Card.js";

class CardModel extends Croquet.Model {

    init({parent: parentModel, cardId: cardId}) {
        this.parentModel = parentModel;
        this.card = new Card(cardId);
        this.Log("Created - " + this.id);
    }

    Log(message) {
        console.log("CARDMODEL: " + message);
    }
}

export { CardModel };