import { canvas } from "./model.js";

class RootView extends Croquet.View {

    /**
    * Constructor for the class.
    * @param {any} model the model of reference
    */
    constructor(model) {
        super(model);
        this.model = model;
        console.log("VIEW subscribed ");
        canvas.addEventListener("click", _ => {this.publish("screen", "click")});
        //TODO: creare oggetti di scena per l'interazione utente + lanciare eventi all'interazione
    }

    //TODO: creare metodi per gestire gli eventi ricevuti dal modello
}

export { RootView };