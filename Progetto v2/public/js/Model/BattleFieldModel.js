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
        const card = Cards.find(c => c.id === cardId);
        const p = this.#battleField.place(card, player === 1);
        if (card.type === "monster") {
            this.getCardCollection("Monsters", player)[p].hasAttacked = true;
        }
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

    hasAvailableSlots(player, cardId) {
        if (Cards.find(c => c.id === cardId).type === "monster") {
            return this.getCardCollection("Monsters", player).some(c => c === null);
        } else {
            return this.getCardCollection("Spells", player).some(c => c === null);
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
            this.attacker = undefined;
            this.target = undefined;
        }
    }

    tryAttack(data) {
        const phase = this.turnModel.phase;
        const isPlayer1Turn = this.turnModel.isPlayer1Turn;
    
        if (phase !== Phase.BattlePhase) return;
        
        if (data.from !== undefined) {
            if (isPlayer1Turn && data.from.player === 2 || !isPlayer1Turn && data.from.player === 1) return;
            const { player, position } = data.from;
            const attacker = this.getCardCollection("Monsters", player)[position];
            if (!attacker || attacker.hasAttacked) return;

            const opponent = player === 1 ? 2 : 1;
            if (!this.getCardCollection("Monsters", opponent).some(c => c !== null)) {
                attacker.hasAttacked = true;
                this.publish(player === 1 ? this.#lifePointsModel.p2.id : this.#lifePointsModel.p1.id, "damage", {amount: attacker.ATK});
                return;
            }

            if (!this.target) {
                this.attacker = data.from;
            } else {
                const {destroyed, damage} = this.#battleField.attack(data.from, this.target);
                if (destroyed === "opponent") {
                    this.publish(this.id, "removeCard", this.target);
                    this.publish(opponent === 1 ? this.#lifePointsModel.p1.id : this.#lifePointsModel.p2.id, "damage", {amount: damage});
                } else if (destroyed === "self") {
                    this.publish(this.id, "removeCard", data.from);
                    this.publish(player === 1 ? this.#lifePointsModel.p1.id : this.#lifePointsModel.p2.id, "damage", {amount: damage});
                } else if (destroyed === "both") {
                    this.publish(this.id, "removeCard", data.from);
                    this.publish(this.id, "removeCard", this.target);
                } else if (destroyed === "none") {}
                if (attacker) attacker.hasAttacked = true;
                this.attacker = undefined;
                this.target = undefined;
                return;
            }
        } else {
            if (!this.attacker) {
                this.target = data.to;
            } else {
                const {destroyed, damage} = this.#battleField.attack(this.attacker, data.to);
                if (destroyed === "opponent") {
                    this.publish(this.id, "removeCard", data.to);
                    this.publish(data.to.player === 1 ? this.#lifePointsModel.p1.id : this.#lifePointsModel.p2.id, "damage", {amount: damage});
                } else if (destroyed === "self") {
                    this.publish(this.id, "removeCard", this.attacker);
                    this.publish(this.attacker.player === 1 ? this.#lifePointsModel.p1.id : this.#lifePointsModel.p2.id, "damage", {amount: damage});
                } else if (destroyed === "both") {
                    this.publish(this.id, "removeCard", data.to);
                    this.publish(this.id, "removeCard", this.attacker);
                } else if (destroyed === "none") {}
                const attacker = this.getCardCollection("Monsters", this.attacker.player)[this.attacker.position];
                if (attacker) attacker.hasAttacked = true;
                this.target = undefined;
                this.attacker = undefined;
            }
        }
    }

    set lifePointsModel(lifePointsModel) {
        this.#lifePointsModel = lifePointsModel;
    }
}

BattleFieldModel.register("BattleFieldModel");

export { BattleFieldModel };