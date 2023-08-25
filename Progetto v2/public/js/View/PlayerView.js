import { BaseView } from "../BaseView.js";
import { LifePointsView } from "./LifePointsView.js";
import { HandView } from "./HandView.js";

class PlayerView extends BaseView {

    
    _initialize() {
        this.lifePoints = new LifePointsView({parent: this, model: this.model.lifePoints});
        this.hand = new HandView({parent: this, model: this.model.hand});
        this.children.push(this.lifePoints);
    }

    _subscribeAll() {
        this.subscribe(this.model.id, "gameOver", this.gameOver);
    }

    gameOver(data) {
        this.parent.gameOver({reason: data.reason});
    }

}

export { PlayerView };