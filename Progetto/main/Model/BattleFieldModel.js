class BattleFieldModel extends Croquet.Model {

    init({parent: parentModel}) {
        this.parentModel = parentModel;
        this.Log("Created - " + this.id);

    }

    Log(message) {
        console.log("BFMODEL: " + message);
    }
}

BattleFieldModel.register("BattleFieldModel");

export { BattleFieldModel };