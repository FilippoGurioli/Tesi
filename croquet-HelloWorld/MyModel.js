class MyModel extends Croquet.Model {
    couter = 0;

    init() {
        this.couter = 0;
        this.subscribe("counter", "reset", this.reset);
        this.future(1000).tick();
    }

    reset() {
        this.couter = 0;
        this.publish("counter", "update");
    }

    tick() {
        this.couter++;
        this.publish("counter", "update");
        this.future(1000).tick();
    }
}

MyModel.register("MyModel");