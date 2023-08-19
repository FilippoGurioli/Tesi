import { LifePointsModel } from "./LifePointsModel.js";

class PlayerModel extends Croquet.Model {
    
    lifePoints = LifePointsModel.create({parent: this});

    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.Log("Created - " + this.id);
    }

    Log(string) {
        console.log("PLAYER: " + string);
    }
}

PlayerModel.register("PlayerModel");

export { PlayerModel };