import { BaseView } from "../BaseView.js";

class LifePointsView extends BaseView { 

    _initializeScene() {
        const handSlate = new BABYLON.GUI.HolographicSlate("viewer");
        handSlate.titleBarHeight = 0;
        this.sharedComponents.GUIManager.addControl(handSlate);
        handSlate.dimensions = new BABYLON.Vector2(20, 13);
        handSlate.position.y += 1.5;
        handSlate.position.z = 0;
        if (this.sharedComponents.camera.position.z > 0) {
                handSlate.node.rotation = new BABYLON.Vector3(0, Math.PI, 0);
        } else {
            handSlate.node.rotation = new BABYLON.Vector3(0, 0, 0);
        }
        
        this.text = new BABYLON.GUI.TextBlock("text");
        this.text.height = 0.8;
        this.text.color = "white";
        this.text.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
        this.text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.text.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.text.paddingTop = "20%";
        this.text.fontWeight = "bold";
        this.text.fontSize = 50;
        this.text.text = this.model.LP + " - " + this.model.opponent.LP;
        
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

    _subscribeAll() {
        this.subscribe(this.model.id, "update", this.showUpdate);
    }
    
    showUpdate() {
        const from1 = parseInt(this.text.text.substring(0, this.text.text.indexOf(" - ")));
        const from2 = parseInt(this.text.text.substring(this.text.text.indexOf(" - ") + 3));
        const to1 = this.model.LP;
        const to2 = this.model.opponent.LP;
        
        const step1 = (to1 - from1) / 60;
        const step2 = (to2 - from2) / 60;
        this.animation(from1, from2, to1, to2, step1, step2);
    }

    animation(from1, from2, to1, to2, step1, step2) {
        if (Math.abs(from1 - to1) <= Math.abs(step1) && Math.abs(from2 - to2) <= Math.abs(step2)) {
            this.text.text = to1 + " - " + to2;
            return;
        }
        from1 += step1;
        from2 += step2;
        this.text.text = Math.round(from1) + " - " + Math.round(from2);
        this.future(30).animation(from1, from2, to1, to2, step1, step2);
    }
}

export { LifePointsView };