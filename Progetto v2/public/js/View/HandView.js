import { BaseView } from "./BaseView.js";

class HandView extends BaseView {

    _initializeScene() {

        hand = [];

        this.model.hand.forEach(cardId => {

        });
    }
}

export { HandView };