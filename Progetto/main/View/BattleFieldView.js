

class BattleFieldView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;

        this.#initializeScene();
        this.Log("Created - " + this.viewId + " - " + this.model.id);
    }

    #initializeScene() {
        this.plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 5 }, this.parentView.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.parentView.scene);
        material.diffuseTexture = new BABYLON.Texture("main/res/yu-gi-oh-battlefield.png", this.parentView.scene);
        material.diffuseTexture.hasAlpha = true;
        this.plane.material = material;
        this.plane.position.y = -1;
        this.plane.rotation.x = Math.PI / 2;
    }

    Log(message) {
        console.log("BFVIEW: " + message);
    }

    detach() {
        super.detach();
        this.plane.dispose();
    }
}

export { BattleFieldView };