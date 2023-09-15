class BattleField {

    p1MonsterField = [null, null, null, null, null];
    p2MonsterField = [null, null, null, null, null];
    p1SpellField = [null, null, null, null, null];
    p2SpellField = [null, null, null, null, null];


    place(card, p1 = true, position = -1) {
        const field = p1 ? (card.type === "spell" || card.type === "trap" ? this.p1SpellField : this.p1MonsterField) : 
        (card.type === "spell" || card.type === "trap" ? this.p2SpellField : this.p2MonsterField);

        if (position >= 0 && position <= 5) {
            field[position] = card;
            return position;
        } else {
            const emptyIndex = field.indexOf(null);
            if (emptyIndex === -1) {
                console.error("No automatic position available");
            } else {
                field[emptyIndex] = card;
            }
            return emptyIndex;
        }
    }

    remove(card) {
        const fields = [this.p1MonsterField, this.p1SpellField, this.p2MonsterField, this.p2SpellField];

        let cardFound = false;
        for (const field of fields) {
            const index = field.indexOf(card);
            if (index !== -1) {
                field[index] = null;
                cardFound = true;
                break;
            }
        }

        if (!cardFound) {
            console.error("Card not found");
        }
    }
}

export { BattleField }; 