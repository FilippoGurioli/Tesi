import { GameModel } from "./Model/GameModel.js";

class RootModel extends Croquet.Model {

    gameModel = null;

    connectedViews = [];

    /**
    * Initialize the Model.
    * */
    init() {
        this.Log(this.id + " created.");

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId) {
        this.connectedViews.push(viewId);

        if (this.gameModel === null) {
            this.gameModel = GameModel.create({parent: this});
        }
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId) {
        this.connectedViews = this.connectedViews.splice(this.connectedViews.indexOf(viewId), 1);
        if(this.connectedViews.length === 0) {
            this.destroy();
        }
    }

    destroyGameModel() {
        this.connectedViews.forEach(viewId => {
            this.publish(this.gameModel.id, "game-over");
        });
        if (this.gameModel !== null) {
            this.gameModel.destroy();
            this.gameModel = null;
        }
    }

    Log(string) {
        console.log("MODEL: " + string);
    }
}

RootModel.register("RootModel");

export { RootModel };