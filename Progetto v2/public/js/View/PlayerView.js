import { BaseView } from "../BaseView.js";
import { LifePointsView } from "./LifePointsView.js";
import { HandView } from "./HandView.js";
import { DeckView } from "./DeckView.js";

class PlayerView extends BaseView {
    
    _initialize() {
        this.lifePoints = new LifePointsView({parent: this, model: this.model.lifePoints});
        this.hand = new HandView({parent: this, model: this.model.hand});
        this.deck = new DeckView({parent: this, model: this.model.deck});
        this.children.push(this.lifePoints, this.hand, this.deck);
    }
}

export { PlayerView };