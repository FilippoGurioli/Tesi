import { BaseView } from "../BaseView.js";

//!dovrà gestire due oggetti: un hand menu che ti fa vedere sempre la vita corrente di entrambi e una slate che compare e scompare quando viene modificata la health
class LifePointsView extends BaseView { 

    _initializeScene() {

        //PERSONAL SLATE (ALWAYS ON)
        // const handSlate = new BABYLON.GUI.HolographicSlate("hand slate");
        // handSlate.titleBarHeight = 0;
        // this.sharedComponents.GUIManager.addControl(handSlate);
        // handSlate.dimensions = new BABYLON.Vector2(5, 5);
        
        // this.text = new BABYLON.GUI.TextBlock("text");
        // this.text.color = "white";
        // this.text.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
        // this.text.fontWeight = "bold";
        // this.text.fontSize = 70;
        // this.text.text = "8000 - 8000";    
        
        // const contentGrid = new BABYLON.GUI.Grid("grid");
        // contentGrid.addControl(this.text);
        // contentGrid.background = "#000080";
        // handSlate.content = contentGrid;

        // if (this.sharedComponents.handTrackingSupport) { //TODO: test
        //     const behaviour = new BABYLON.HandConstraintBehaviour();
        //     behaviour.targetZone = BABYLON.HandContraintsZone.BELOW_WRIST;
        // } else {
        //     //normal slate..
        // }
        
        // this.sceneObjects.push(handSlate, contentGrid, this.text);
    }
}

export { LifePointsView };