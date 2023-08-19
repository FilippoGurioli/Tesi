class Deck extends Croquet.Model {

    #deck = [
        //qui creare una carta
    ];

    init({parent: parentModel}) { //TODO: passare al costruttore un modo per generare il deck
        this.parentModel = parentModel;
        Log("Created - " + this.id);
    }

    draw() {
        if (this.#deck.length === 0) {
            throw new Error("Deck is empty");
        }
        return this.#deck.pop();
    }

    Log(message) {
        console.log("DECKMODEL | " + this.id.substring(this.id.length - 2) + ": " + message);
    }
}