class LifePointsView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log("Created.");

        this.#initializeScene();
        this.updateHUD();
    }

    #initializeScene() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.GUIManager = new BABYLON.GUI.GUI3DManager(this.parentView.scene);
        this.GUIManager.useRealisticScaling = true;

        //HUD
        this.HUD = new BABYLON.GUI.Rectangle();
        this.HUD.width = "200px";
        this.HUD.height = "60px";
        this.HUD.cornerRadius = 20;
        this.HUD.color = "Red";
        this.HUD.thickness = 4;
        this.HUD.background = "black";
        this.HUD.alpha = 0.5;
        this.HUD.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.HUD.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.HUD.top = "120px";
        this.advancedTexture.addControl(this.HUD);

        this.text = new BABYLON.GUI.TextBlock();
        this.text.color = "white";
        this.text.fontSize = 24;
        this.text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.text.paddingLeft = "20px";
        this.HUD.addControl(this.text);
    }

    updateHUD() {
        this.text.text = "LP: " + this.model.LP;
        this.future(500).updateHUD();
    }

    Log(string) {
        console.log("LPVIEW: " + string);
    }

    detach() {
        this.Log("Detached.");
        super.detach();
    }
}

export { LifePointsView };