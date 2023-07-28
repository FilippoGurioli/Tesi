class MyView extends Croquet.View {

    constructor(model) {
        console.log("VIEW: created");
        super(model);
        this.model = model;
        countDisplay.onclick = event => this.counterReset();
        this.subscribe("counter", "changed", this.counterChanged);
        this.counterChanged();
    }

    counterReset() {
        this.publish("counter", "reset");
    }

    counterChanged() {
        console.log("VIEW: received message");
        countDisplay.textContent = this.model.count;
    }

}

export { MyView };