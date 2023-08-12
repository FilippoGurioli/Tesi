class LifePointsView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log("Created.");
    }

    Log(string) {
        //console.log("LPVIEW: " + string);
    }
}

export { LifePointsView };