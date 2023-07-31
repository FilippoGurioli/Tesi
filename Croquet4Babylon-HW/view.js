class RootView extends Croquet.View {

    /**
    * Constructor for the class.
    * @param {any} model the model of reference
    */
    constructor(model) {
        super(model);
        this.model = model;
        console.log("VIEW subscribed ");
        this.subscribe("consoleLog", "click", this.click);
        //TODO: creare oggetti di scena per l'interazione utente + lanciare eventi all'interazione
    }

    click() {
        console.log("click");
    }

    //TODO: creare metodi per gestire gli eventi ricevuti dal modello
}

export { RootView };