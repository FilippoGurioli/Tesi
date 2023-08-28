import { BaseView } from "../BaseView.js";

//!dovrà gestire due oggetti: un hand menu che ti fa vedere sempre la vita corrente di entrambi e una slate che compare e scompare quando viene modificata la health
class LifePointsView extends BaseView { 

    _initializeScene() {

        //PERSONAL SLATE (ALWAYS ON)
        const handSlate = new BABYLON.GUI.HolographicSlate("hand slate");
        handSlate.titleBarHeight = 0;
        this.sharedComponents.GUIManager.addControl(handSlate);
        handSlate.dimensions = new BABYLON.Vector2(1, 0.5);
        handSlate.minDimensions = new BABYLON.Vector2(0.5, 0.25);
        
        this.text = new BABYLON.GUI.TextBlock("text");
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

        let behaviour;
        if (this.sharedComponents.xrHelper.baseExperience.featuresManager.getEnabledFeature(BABYLON.WebXRFeatureName.HAND_TRACKING)) { //TODO: test
            behaviour = new BABYLON.HandConstraintBehaviour();
            behaviour.targetZone = BABYLON.HandContraintsZone.BELOW_WRIST;
            behaviour.attach(handSlate.node);
        } else {
            behaviour = new BABYLON.FollowBehavior();
            behaviour.followHeightOffset = 0.5;
            behaviour.followLerpSpeed = 0.1;
            behaviour.target = this.sharedComponents.camera;
            behaviour.attach(handSlate.node);
        }
        
        this.sceneObjects.push(handSlate, contentGrid, this.text);
    }

    _update() {
        this.text.text = this.model.LP + " - " + this.model.opponent.LP;
    }
}

export { LifePointsView };