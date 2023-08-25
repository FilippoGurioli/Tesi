import { BaseModel } from "../BaseModel.js";
import { LifePoints } from "../MyModels/LifePoints.js";

class LifePointsModel extends BaseModel {

    #lifePoints = new LifePoints();

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
            this.parent.gameOver();
        }
    }

    get LP() {
        return this.#lifePoints.LP;
    }
}

LifePointsModel.register("LifePointsModel");

export { LifePointsModel };