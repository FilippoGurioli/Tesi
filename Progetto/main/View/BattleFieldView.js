

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

        //Fade in animation
        this.plane.visibility = 0;
        const fadeInAnimation = new BABYLON.Animation(
            "fadeInAnimation",
            "visibility", 
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        const fadeInKeys = [
            { frame: 0, value: 0 },  
            { frame: 60, value: 1 }  
        ];
        fadeInAnimation.setKeys(fadeInKeys);
        this.plane.animations.push(fadeInAnimation);
        this.parentView.scene.beginAnimation(this.plane, 0, 60, false);
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