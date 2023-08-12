import { LifePoints } from "./LifePoints.js";

class LifePointsModel extends Croquet.Model {
    
    lifePoints = new LifePoints();

    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.Log("Created.");

        this.subscribe(this.id, "heal", this.heal);
        this.subscribe(this.id, "damage", this.damage);
    }

    heal(lifePoints) {
        this.lifePoints.heal(lifePoints);
    }

    damage(lifePoints) {
        this.lifePoints.damage(lifePoints);
    }

    Log(string) {
        //console.log("LPMODEL: " + string);
    }
}

LifePointsModel.register("LifePointsModel");

export { LifePointsModel };