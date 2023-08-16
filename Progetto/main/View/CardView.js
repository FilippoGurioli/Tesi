class CardView extends Croquet.View {

    costructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log("Created - " + this.viewId + " - " + this.model.id);
    }

    Log(message) {
        console.log("CARDVIEW: " + message);
    }
}