class BattleField {

    p1MonsterField = [null, null, null, null, null];
    p2MonsterField = [null, null, null, null, null];
    p1SpellField = [null, null, null, null, null];
    p2SpellField = [null, null, null, null, null];


    place(card, p1 = true, position = -1) {
        if (p1) {
            if (card.type === "spell" || card.type === "trap") {
                if (position >= 0 && position <= 5) {
                    this.p1SpellField[position] = card;
                } else {
                    if (this.p1SpellField.indexOf(null) === -1)    console.error("No automatic position available");
                    this.p1SpellField[this.p1SpellField.indexOf(null)] = card;
                }
            } else {
                if (position >= 0 && position <= 5) {
                    this.p1MonsterField[position] = card;
                } else {
                    if (this.p1MonsterField.indexOf(null) === -1)    console.error("No automatic position available");
                    this.p1MonsterField[this.p1MonsterField.indexOf(null)] = card;
                }
            }
        } else {
            if (card.type === "spell" || card.type === "trap") {
                if (position >= 0 && position <= 5) {
                    this.p2SpellField[position] = card;
                } else {
                    if (this.p2SpellField.indexOf(null) === -1)    console.error("No automatic position available");
                    this.p2SpellField[this.p2SpellField.indexOf(null)] = card;
                }
            } else {
                if (position >= 0 && position <= 5) {
                    this.p2MonsterField[position] = card;
                } else {
                    if (this.p2MonsterField.indexOf(null) === -1)    console.error("No automatic position available");
                    this.p2MonsterField[this.p2MonsterField.indexOf(null)] = card;
                }
            }
        }
    }

    remove(card) {
        if (this.p1MonsterField.includes(card)) {
            this.p1MonsterField[this.p1MonsterField.indexOf(card)] = null;
        } else if (this.p1SpellField.includes(card)) {
            this.p1SpellField[this.p1SpellField.indexOf(card)] = null;
        } else if (this.p2MonsterField.includes(card)) {
            this.p2MonsterField[this.p2MonsterField.indexOf(card)] = null;
        } else if (this.p2SpellField.includes(card)) {
            this.p2SpellField[this.p2SpellField.indexOf(card)] = null;
        } else {
            console.error("Card not found");
        }
    }
}

export { BattleField }; 