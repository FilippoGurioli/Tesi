import { BaseModel } from "../BaseModel.js";
import { BattleField } from "../MyModels/BattleField.js";
import { Cards } from "../Utils/Constants.js";

class BattleFieldModel extends BaseModel {

    #battleField = new BattleField();

    placeCard(player, cardId) {
        this.#battleField.place(Cards.find(c => c.id === cardId), player === 1);
    }

    getBattleFieldOf(p1 = true) {
        if (p1) {
            return { monster: this.#battleField.p1MonsterField, spell: this.#battleField.p1SpellField };
        } else {
            return { monster: this.#battleField.p2MonsterField, spell: this.#battleField.p2SpellField };
        }
    }

    getMonsters() {
        return { p1: this.#battleField.p1MonsterField, p2: this.#battleField.p2MonsterField };
    }

    getSpells() {
        return { p1: this.#battleField.p1SpellField, p2: this.#battleField.p2SpellField };
    }

    place(card, p1 = true, position = -1) {
        this.#battleField.place(card, p1, position);
    }

    remove(card) {
        this.#battleField.remove(card);
    }

}

BattleFieldModel.register("BattleFieldModel");

export { BattleFieldModel };