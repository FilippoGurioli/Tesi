import { BaseView } from "../BaseView.js";
import { LifePointsView } from "./LifePointsView.js";

class PlayerView extends BaseView {

    
    _initialize() {
        this.lifePoints = new LifePointsView({parent: this, model: this.model.lifePoints});
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