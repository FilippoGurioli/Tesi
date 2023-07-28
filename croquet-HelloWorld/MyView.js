class MyView extends Croquet.View
{
    constructor(model) {
        super(model);
        this.model = model;
        this.subscribe("counter", "update", this.update);
        document.getElementById("contatore").addEventListener("click", _ => { this.publish("counter", "reset") });
    }

    update() {
        contatore.textContent = this.model.couter;
    }
}

Croquet.Session.join({
    appId: "it.unibo.studio.filippo.gurioli.microverse",
    apiKey: "1HE1txmpJCe5Cp8Pzd3Dpmq4a9gu6PqKhar4tcHtq",
    name: "Hello World",
    password: "psw",
    model: MyModel,
    view: MyView
});