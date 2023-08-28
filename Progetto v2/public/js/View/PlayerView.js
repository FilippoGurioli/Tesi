import { BaseView } from "../BaseView.js";
import { LifePointsView } from "./LifePointsView.js";
import { HandView } from "./HandView.js";

class PlayerView extends BaseView {
    
    _initialize() {
        this.lifePoints = new LifePointsView({parent: this, model: this.model.lifePoints});
        this.hand = new HandView({parent: this, model: this.model.hand});
        this.children.push(this.lifePoints, this.hand);
    }
}

export { PlayerView };