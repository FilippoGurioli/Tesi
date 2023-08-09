class BattleField {
    
    p1MonsterField = [null, null, null, null, null];
    p2MonsterField = [null, null, null, null, null];
    p1SpellField = [null, null, null, null, null];
    p2SpellField = [null, null, null, null, null];

    placeMonster(card, player, position) {
        if (player === 1) {
            this.p1MonsterField[position] = card;
        } else {
            this.p2MonsterField[position] = card;
        }
    }

    placeSpell(card, player, position) {
        if (player === 1) {
            this.p1SpellField[position] = card;
        } else {
            this.p2SpellField[position] = card;
        }
    }

    
}