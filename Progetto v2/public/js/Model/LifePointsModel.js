import { BaseModel } from "../BaseModel.js";
import { LifePoints } from "../MyModels/LifePoints.js";

class LifePointsModel extends BaseModel {

    #lifePoints = new LifePoints();

    #opponent = null;

    _subscribeAll() {
        this.subscribe(this.id, "heal", this.heal);
        this.subscribe(this.id, "damage", this.damage);
    }

    heal(data) {
        this.#lifePoints.heal(data.lifePoints);
        this._log("healed " + data.lifePoints + " LP");
    }

    damage(data) {
        this.#lifePoints.damage(data.lifePoints);
        this._log("damaged " + data.lifePoints + " LP");
        if (this.#lifePoints.LP === 0) {
            this.publish(this.sessionId, "game-over", {winner: this.opponent.id});
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