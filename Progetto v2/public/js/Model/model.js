import { BaseModel } from "../BaseModel.js";

class RootModel extends BaseModel {

    _initialize() {
        this.linkedViews = [];
        this.gameModel = null;
    }

    _subscribeAll() {
        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId){
        this._log("received view join " + viewId);
        this.linkedViews.push(viewId);
        if (this.gameModel === null) {
            //this.gameModel = GameModel.create({parent: this});
            //this.children.push(this.gameModel);
            console.log("CREAZIONE GAMEMODEL");
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

    //! ci sarebbe destroyGameModel ma provo a non metterlo attualmente
}


RootModel.register("RootModel");


export { RootModel };