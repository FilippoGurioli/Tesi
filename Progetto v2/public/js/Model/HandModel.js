import { BaseModel } from "../BaseModel.js";

class HandModel extends BaseModel {
    
    #hand = [];

    _initialize(data) {
        this.battleField = data.battleField;
        this.#hand = data.hand;
    }

    get hand() {
        return this.#hand;
    }
}

HandModel.register("HandModel");

export { HandModel };