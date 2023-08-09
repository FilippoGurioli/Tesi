class Card {
    constructor(id, name, image, description) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.description = description;
        this.position = position;
    }

    activateEffect() {
        console.log("Card " + this.name + " effect activated: " + this.description);
    }
}

export { Card };