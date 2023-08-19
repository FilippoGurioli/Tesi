class DeckModel extends Croquet.Model {

    #deck = [
        //qui creare una carta
    ];

    init({parent: parentModel}) { //TODO: passare al costruttore un modo per generare il deck
        this.parentModel = parentModel;
        this.Log("Created");
    }

    draw() {
        if (this.#deck.length === 0) {
            throw new Error("Deck is empty");
        }
        this.Log("Drawn card");
        return this.#deck.pop();
    }

    shuffle() {
        this.#deck.sort(() => Math.random() - 0.5);
    }

    addCardOnTop(card) {
        this.#deck.push(card);
        Log("Added card on top " + card);
    }

    addCardOnBack(card) {
        this.#deck.unshift(card);
        Log("Added card on back " + card);
    }

    Log(message) {
        console.log("DECKMODEL | " + this.id.substring(this.id.length - 2) + ": " + message);
    }
}

DeckModel.register("DeckModel");

export { DeckModel };