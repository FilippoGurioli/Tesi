import { BaseModel } from "../BaseModel.js";
import { BattleField } from "../MyModels/BattleField.js";
import { Cards } from "../Utils/Constants.js";
import { Phase } from "../MyModels/Turn.js";

class BattleFieldModel extends BaseModel {

    #battleField = new BattleField();
    #lifePointsModel;

    _subscribeAll() {
        this.subscribe(this.id, "attack", this.tryAttack);
    }

    _initialize(data) {
        this.turnModel = data.turnModel;
        this.subscribe(this.turnModel.id, "nextPhase", this.reset);
    }

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

    getCardCollection(type, player) {
        if (type === "Monsters") {
            return player === 1 ? this.#battleField.p1MonsterField : this.#battleField.p2MonsterField;
        } else if (type === "Spells") {
            return player === 1 ? this.#battleField.p1SpellField : this.#battleField.p2SpellField;
        } else {
            console.error("Invalid type");
        }
    }

    remove(card) {
        this.#battleField.remove(card);
        this.publish(this.id, "removeCard", card);
    }

    reset() {
        if (this.turnModel.phase === Phase.EndPhase) {
            this.#battleField.p1MonsterField.forEach(c => {
                if (c !== null) c.hasAttacked = false;
            });
            this.#battleField.p2MonsterField.forEach(c => {
                if (c !== null) c.hasAttacked = false;
            });
        }
    }

    tryAttack(data) {
        if (((this.turnModel.isPlayer1Turn && data.player === 1) || (!this.turnModel.isPlayer1Turn && data.player === 2)) && this.turnModel.phase === Phase.BattlePhase) {
            const attacker = this.getCardCollection("Monsters", data.player)[data.position];
            if (!attacker.hasAttacked) {
                this.publish(data.player === 1 ? this.#lifePointsModel.p2.id : this.#lifePointsModel.p1.id, "damage", {amount: attacker.ATK});
            }
            attacker.hasAttacked = true;
        }
    }

    set lifePointsModel(lifePointsModel) {
        this.#lifePointsModel = lifePointsModel;
    }
}

BattleFieldModel.register("BattleFieldModel");

export { BattleFieldModel };