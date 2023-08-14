import { GameModel } from "./Model/GameModel.js";

class RootModel extends Croquet.Model {

    gameModel = null;

    connectedViews = [];

    /**
    * Initialize the Model.
    * */
    init() {
        this.Log("Created - " + this.id);

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId) {
        this.connectedViews.push(viewId);
        this.Log("View connected: " + viewId + ", connected views: " + this.connectedViews.length);
        if (this.gameModel === null) {
            this.gameModel = GameModel.create({parent: this});
        }
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId) {
        this.connectedViews.splice(this.connectedViews.indexOf(viewId), 1);
        this.Log("View disconnected: " + viewId + ", connected views: " + this.connectedViews.length + ".");
        if(this.connectedViews.length === 0) {
            this.destroy();
        }
    }

    destroyGameModel() {
        this.Log("Destroying game model.");
        this.gameModel.destroy();
        this.Log("Connected Views: " + this.connectedViews.length + ".");
        this.gameModel = GameModel.create({parent: this}); //for testing, probably has to be changed with an if
    }

    Log(string) {
        console.log("MODEL: " + string);
    }
}

RootModel.register("RootModel");

export { RootModel };