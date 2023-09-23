import { BaseModel } from "../BaseModel.js";
import { LifePoints } from "../MyModels/LifePoints.js";

class LifePointsModel extends BaseModel {

    #lifePoints = new LifePoints();

    #opponent = null;

    _subscribeAll() {
        this.subscribe(this.id, "heal", this.heal);
        this.subscribe(this.id, "damage", this.damage);
        this.subscribe(this.id, "info", (data) => {console.log("Broadcast from LPView: "); console.log(data)});
    }

    heal(data) {
        this.#lifePoints.heal(data.amount);
        this._log("healed " + data.amount + " LP");
    }

    damage(data) {
        this.#lifePoints.damage(data.amount);
        this._log("damaged " + data.amount + " LP");
        if (this.#lifePoints.LP === 0) {
            this.publish(this.sessionId, "game-over", {winner: this.opponent.parent.role});
        }
    }

    get LP() {
        return this.#lifePoints.LP;
    }

    get opponent() {
        return this.#opponent;
    }

    set opponent(opponent) {
        this.#opponent = opponent;
    }
}

LifePointsModel.register("LifePointsModel");

export { LifePointsModel };