import { LifePoints } from "./LifePoints.js";

class LifePointsModel extends Croquet.Model {
    
    #lifePoints = new LifePoints();

    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.Log("Created");

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
            this.publish(this.parentModel.id, "gameOver");
        }
    }

    Log(string) {
        console.log("LPMODEL | " + this.id.substring(this.id.length - 2) + ": " + string);
    }

    get LP() {
        return this.#lifePoints.LP;
    }
}

LifePointsModel.register("LifePointsModel");

export { LifePointsModel };