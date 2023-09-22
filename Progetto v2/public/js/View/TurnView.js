import { BaseView } from "../BaseView.js";

class TurnView extends BaseView {

    
    _initialize(data) {
        this.role = data.role;
        this.resumeInfo = "";
        this.standby = false;
    }

    _subscribeAll() {
        this.subscribe(this.viewId, "opponent-left", () => this.displaySpecialMessage("Opponent disconnected..."));
        this.subscribe(this.viewId, "opponent-recover", () => this.resume());
    }

    _initializeScene() {

        //SLATE
        const slate = new BABYLON.GUI.HolographicSlate("slate");
        slate.titleBarHeight = 0;
        this.sharedComponents.GUIManager.addControl(slate);
        slate.dimensions = new BABYLON.Vector2(10, 7);
        slate.position.y += 1;
        slate.position.z = 0;
        
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
        if (this.sharedComponents.xrHelper.baseExperience.featuresManager.getEnabledFeature(BABYLON.WebXRFeatureName.HAND_TRACKING)) 
                this.turnMenu = new BABYLON.GUI.HandMenu("Turn Menu");
        else    this.turnMenu = new BABYLON.GUI.NearMenu("Turn Menu");
        this.button = new BABYLON.GUI.TouchHolographicButton("Next Phase");
        this.button.text = "Next Phase";
        this.button.onPointerDownObservable.add(() => {
            if (!this.standby) {
                this.publish(this.model.id, "nextPhase");
            }
        });
        this.sharedComponents.GUIManager.addControl(this.turnMenu);
        this.turnMenu.addButton(this.button);
        this.turnMenu.isVisible = false;

        // if (this.role === "Player 1" && this.model.parent.playersInfo.p2.viewId === "")   this.displaySpecialMessage("Waiting for player 2...");
        switch(this.role) {
            case "Player 1":
                slate.node.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                if (this.model.parent.playersInfo.p2.viewId === "")  this.displaySpecialMessage("Waiting for player 2...");
                break;
            case "Player 2":
                slate.node.rotation = new BABYLON.Vector3(0, 0, 0);
                break;
            default:
                slate.node.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
                break;
        }

        this.sceneObjects.push(slate, contentGrid, this.text, title, this.turnMenu, this.button);
    }

    _update() {
        if (this.standby) return;
        
        const lines = this.text.text.split("\n");

        if (this.model.isPlayer1Turn && this.role === "Player 1" || !this.model.isPlayer1Turn && this.role === "Player 2") {
            lines[0] = "Your turn";
            this.turnMenu.isVisible = true;
        } else if (this.model.isPlayer1Turn && this.role === "Player 2" || !this.model.isPlayer1Turn && this.role === "Player 1") {
            lines[0] = "Opponent's turn";
            this.turnMenu.isVisible = false;
        } else {
            if (this.model.isPlayer1Turn) {
                lines[0] = "Player 1's turn";
            } else {
                lines[0] = "Player 2's turn";
            }
        }

        lines[1] = this.model.phase;
        
        this.text.text = lines.join("\n");
        
        this.resumeInfo = this.text.text;
    }

    _endScene(data) {
        let message = "";
        if (data.winner === this.viewId) message = "You won!";
        else                             message = "You lost!";
        if (this.role === "a Spectator") {
            if (data.winner === this.model.parent.playersInfo.p1.viewId)
                message = "Player 1 won!";
            else
                message = "Player 2 won!";
        }
        this.displaySpecialMessage(message);
        return 6000;
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