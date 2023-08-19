import { BattleField } from "./BattleField.js";

class BattleFieldModel extends Croquet.Model {

    #battleField = new BattleField();

    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.Log("Created");
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

    Log(message) {
        console.log("BFMODEL | " + this.id.substring(this.id.length - 2) + ": " + message);
    }
}

BattleFieldModel.register("BattleFieldModel");

export { BattleFieldModel };