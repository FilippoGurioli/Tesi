import { BaseModel } from "./BaseModel.js";

class RootModel extends BaseModel {

    _initialize() {
        this.linkedViews = [];
        this.sphereColor = "white";
    }

    _subscribeAll() {
        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop)
        this.subscribe("colorButton", "clicked", this.changeHologramColor);
    }
    
    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId){
        console.log("MODEL: received view join");
        this.linkedViews.push(viewId);
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId){
        console.log("MODEL: received view left");
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
    }

    /**
     * Change the color of the hologram.
     * @param {any} data object containing the color to apply.
     */
    changeHologramColor(data){
        console.log("MODEL: receive color button clicked");
        console.log(data);
        this.sphereColor = this.#computeColor(data.color);
    }

    #computeColor(colorName){
        switch (colorName) {
            case "Blue":
                return "blue";
                break;
            case "Red":
                return "red";
                break;
            case "Green":
                return "green";
                break;
            case "Purple":
                return "purple";
                break;
            case "Yellow":
                return "yellow";
                break;
            case "Teal":
                return "teal";
                break;
            default:
                return "white";
        }
    }
}


RootModel.register("RootModel");


export { RootModel };