import { BaseView } from "../BaseView.js";

class TurnView extends BaseView {

    
    _initialize(data) {
        this.role = data.role;
        this.resumeInfo = "";
        this.standby = false;
    }

    _initializeScene() {

        //SLATE
        const slate = new BABYLON.GUI.HolographicSlate("slate");
        slate.titleBarHeight = 0;
        this.sharedComponents.GUIManager.addControl(slate);
        slate.dimensions = new BABYLON.Vector2(15, 11);
        slate.node.position = new BABYLON.Vector3(-8, 8, 0);
        switch(this.role) {
            case "Player 1":
                slate.node.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                break;
            case "Player 2":
                slate.node.rotation = new BABYLON.Vector3(0, 0, 0);
                break;
            default:
                slate.node.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
                break;
        }
        
        const title = new BABYLON.GUI.TextBlock("title");
        title.height = 0.2;
        title.color = "white";
        title.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
        title.setPadding("5%", "5%", "5%", "5%");
        title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        title.fontWeight = "bold";
        title.fontSize = 70;
        title.text = this.role.toUpperCase();
        if (this.role === "a Spectator") title.text = "SPECTATOR";
        
        this.text = new BABYLON.GUI.TextBlock("text");
        this.text.height = 0.8;
        this.text.color = "white";
        this.text.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
        this.text.setPadding("5%", "5%", "5%", "5%");
        this.text.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.text.fontSize = 50;
        this.text.text = "TURN\nPHASE";
        
        
        const contentGrid = new BABYLON.GUI.Grid("grid");
        contentGrid.addControl(title);
        contentGrid.addControl(this.text);
        contentGrid.background = "#000080";
        slate.content = contentGrid;

        //TURN MENU
        if (this.sharedComponents.handTrackingSupport) this.turnMenu = new BABYLON.GUI.HandMenu("Turn Menu");
        else                                           this.turnMenu = new BABYLON.GUI.NearMenu("Turn Menu");
        this.button = new BABYLON.GUI.TouchHolographicButton("Next Phase");
        this.button.text = "Next Phase";
        this.button.onPointerDownObservable.add(() => {
            if (!this.standby)   this.publish(this.model.id, "nextPhase");
        });
        this.sharedComponents.GUIManager.addControl(this.turnMenu);
        this.turnMenu.addButton(this.button);
        this.turnMenu.isVisible = false;
        this.sceneObjects.push(slate, contentGrid, this.text, title, this.turnMenu, this.button);
    }

    _update() {
        if (this.standby) return;
        
        const lines = this.text.text.split("\n");

        if (this.model.turn.isPlayer1Turn && this.role === "Player 1" || !this.model.turn.isPlayer1Turn && this.role === "Player 2") {
            lines[0] = "Your turn";
            this.turnMenu.isVisible = true;
        } else if (this.model.turn.isPlayer1Turn && this.role === "Player 2" || !this.model.turn.isPlayer1Turn && this.role === "Player 1") {
            lines[0] = "Opponent's turn";
            this.turnMenu.isVisible = false;
        } else {
            if (this.model.turn.isPlayer1Turn) {
                lines[0] = "Player 1's turn";
            } else {
                lines[0] = "Player 2's turn";
            }
        }

        lines[1] = this.model.turn.phase;
        
        this.text.text = lines.join("\n");
        
        this.resumeInfo = this.text.text;
    }

    displaySpecialMessage(message) {
        this.resumeInfo = this.text.text;
        this.text.text = message;
        this.standby = true;
        this.turnMenu.isVisible = false;
    }

    resume() {
        this.text.text = this.resumeInfo;
        this.standby = false;
        this.turnMenu.isVisible = true;
    }

}

export { TurnView };