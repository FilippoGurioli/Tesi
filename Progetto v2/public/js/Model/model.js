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
        this._log("This model is " + this.id.substring(0, this.id.length - 3)); 
        this.gameOverTest();
    }

    gameOverTest() {
        this.counter++;
        if (this.counter > 14 || this.counter === 10) {
            this._log("Counter: " + this.counter + "/20");
        } 
        if (this.counter < 20) {
            this.future(1000).gameOverTest();
        } else {
            this._log("LAUNCHING GAME OVER");
            this.publish(this.sessionId, "game-over");
            this.counter = 0;
            this.future(1000).gameOverTest();
        }
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId){
        this._log("received view join " + viewId);
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
        this._log("received view left " + viewId);
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
    }

    _gameOver() {
        this._log("Restarting game model");
        this.gameModel = GameModel.create({parent: this}); //for testing, probably has to be changed with an if
    }
}

RootModel.register("RootModel");

export { RootModel };