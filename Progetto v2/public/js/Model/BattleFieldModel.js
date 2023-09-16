import { BaseModel } from "../BaseModel.js";
import { BattleField } from "../MyModels/BattleField.js";
import { Cards } from "../Utils/Constants.js";

class BattleFieldModel extends BaseModel {

    #battleField = new BattleField();

    place(player, cardId) {
        const p = this.#battleField.place(Cards.find(c => c.id === cardId), player === 1);
        
        this.publish(this.id, "placeCard", {
            player: player,
            position: p,
            id: cardId
        });
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

    remove(card) {
        this.#battleField.remove(card);

        this.publish(this.id, "removeCard", card);
    }

}

BattleFieldModel.register("BattleFieldModel");

export { BattleFieldModel };