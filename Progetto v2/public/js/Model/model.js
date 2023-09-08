import { BaseModel } from "../BaseModel.js";
import { GameModel } from "./GameModel.js";

class RootModel extends BaseModel {

    counter = 0;

    _subscribeAll() {
        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);
    }

    _initialize() {
        this.linkedViews = [];
        this.gameModel = null;
        this._log("This session id is " + this.sessionId); 
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId){
        this.linkedViews.push(viewId);
        if (this.gameModel === null) {
            this.gameModel = GameModel.create({parent: this});
        }
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId){
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
    }

    _gameOver() {
        this._log("Game over: restarting game model");
        this.future(2000).restart(); //safe time to be sure that all models have been destroyed
    }

    restart() {
        this.gameModel = GameModel.create({parent: this});
    }
}

RootModel.register("RootModel");

export { RootModel };