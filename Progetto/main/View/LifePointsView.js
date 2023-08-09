class LifePointsView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log(this.viewId + " created.");
    }

    Log(string) {
        console.log("LPVIEW: " + string);
    }
}

export { LifePointsView };