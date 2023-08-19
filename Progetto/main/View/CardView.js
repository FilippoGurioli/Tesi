class CardView extends Croquet.View {

    costructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log("Model associated: " + this.model.id.substring(this.id.length - 2));
    }

    Log(message) {
        console.log("CARDVIEW: " + message);
    }
}