import { BaseView } from "../BaseView.js";

class LifePointsView extends BaseView { 

    _initializeScene() {

        const handSlate = new BABYLON.GUI.HolographicSlate("hand slate");
        handSlate.titleBarHeight = 0;
        this.sharedComponents.GUIManager.addControl(handSlate);
        handSlate.dimensions = new BABYLON.Vector2(15, 11);
        handSlate.minDimensions = new BABYLON.Vector2(0.5, 0.25);
        handSlate.position = new BABYLON.Vector3(-8, 7.5, 0);
        
        this.text = new BABYLON.GUI.TextBlock("text");
        this.text.height = 0.8;
        this.text.color = "white";
        this.text.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
        this.text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.text.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.text.paddingTop = "20%";
        this.text.fontWeight = "bold";
        this.text.fontSize = 50;
        
        const contentGrid = new BABYLON.GUI.Grid("grid");
        contentGrid.addControl(this.text);
        contentGrid.background = "#000080";
        handSlate.content = contentGrid;

        if (this.sharedComponents.xrHelper.baseExperience.featuresManager.getEnabledFeatures().indexOf(BABYLON.WebXRFeatureName.HAND_TRACKING) !== -1) {
            handSlate.dimensions = new BABYLON.Vector2(1, 0.5);
            const behaviour = new BABYLON.HandConstraintBehaviour();
            behaviour.targetZone = BABYLON.HandContraintsZone.BELOW_WRIST;
            behaviour.attach(handSlate.node);
        }
        
        this.sceneObjects.push(handSlate, contentGrid, this.text);
        
    }

    _update() {
        this.text.text = this.model.LP + " - " + this.model.opponent.LP;
    }
}

export { LifePointsView };