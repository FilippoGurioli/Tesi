import { LifePoints } from "./LifePoints.js";

class LifePointsModel extends Croquet.Model {
    
    #lifePoints = new LifePoints();

    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.Log("Created - " + this.id);

        this.subscribe(this.id, "heal", this.heal);
        this.subscribe(this.id, "damage", this.damage);
    }

    heal(lifePoints) {
        this.#lifePoints.heal(lifePoints);
        this.Log("heal:" + this.#lifePoints.LP);
    }

    damage(lifePoints) {
        this.#lifePoints.damage(lifePoints);
        if (this.#lifePoints.LP === 0) {
            this.parentModel.gameOver(this.id);
        }
    }

    Log(string) {
        console.log("LPMODEL: " + string);
    }

    get LP() {
        return this.#lifePoints.LP;
    }
}

LifePointsModel.register("LifePointsModel");

export { LifePointsModel };