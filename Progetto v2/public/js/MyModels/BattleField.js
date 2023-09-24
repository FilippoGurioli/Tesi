class BattleField {

    p1MonsterField = [null, null, null, null, null];
    p2MonsterField = [null, null, null, null, null];
    p1SpellField = [null, null, null, null, null];
    p2SpellField = [null, null, null, null, null];


    place(card, p1 = true, position = -1) {
        const field = p1 ? (card.type === "spell" || card.type === "trap" ? this.p1SpellField : this.p1MonsterField) : 
        (card.type === "spell" || card.type === "trap" ? this.p2SpellField : this.p2MonsterField);
        const copy = {...card};
        if (position >= 0 && position <= 5) {
            field[position] = copy;
            return position;
        } else {
            const emptyIndex = field.indexOf(null);
            if (emptyIndex === -1) {
                console.error("No automatic position available");
            } else {
                field[emptyIndex] = copy;
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

    attack(from, to) {
        let attacker, defender;
        if (from.player === 1) {
            attacker = this.p1MonsterField[from.position];
            defender = this.p2MonsterField[to.position];
        } else {
            attacker = this.p2MonsterField[from.position];
            defender = this.p1MonsterField[to.position];
        }
        const diff = attacker.ATK - defender.ATK;
        if (diff > 0) {
            this.clearMonsterField(to);
            return { destroyed: "opponent", damage: diff };
        } else if (diff < 0) {
            this.clearMonsterField(from);
            return { destroyed: "self", damage: -diff };
        } else {
            this.clearMonsterField(from);
            return { destroyed: "both", damage: 0 };
        }
    }
    
    clearMonsterField(card) {
        const field = card.player === 1 ? this.p1MonsterField : this.p2MonsterField;
        field[card.position] = null;
    }
}

export { BattleField }; 