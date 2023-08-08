import { Constants } from "../Utils/Constants.js";
import { TurnView } from "./TurnView.js";
import { Role } from "./Role.js";

class GameView extends Croquet.View {
    
    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log("View " + this.viewId + " created from model " + this.model.id + ".");
        this.#setRole();
        this.#initializeScene();
        new TurnView(this.model.turnModel, this);

        this.subscribe(this.model.turnModel.id, "changeTurn", this.changeTurn);
    }

    changeTurn(viewId) {
        if (this.viewId === viewId) {
            this.overlayText("Your turn", 3000);
        } else if (this.viewId !== viewId && this.role !== Role.SPECTATOR) {
            this.overlayText("Opponent's turn", 3000);
        } else if (this.role == Role.SPECTATOR) {
            if (this.model.players.p1 === viewId) {
                this.overlayText("Player 1's turn", 3000);
            } else {
                this.overlayText("Player 2's turn", 3000); 
            }
        }
        //! TODO: fixare sto scempio, possibile miglioria: far sì che il parametro sia il player e non la viewId
    }

    #setRole() {
        if (this.model.players.p1.viewId === this.viewId) {
            this.role = Role.PLAYER1;
            this.overlayText("You are Player 1", 3000);
        } else if (this.model.players.p2.viewId === this.viewId) {
            this.role = Role.PLAYER2;
            this.overlayText("You are Player 2", 3000);
        } else {
            this.role = Role.SPECTATOR;
            this.overlayText("You are a Spectator", 3000);
        }
    }

    #initializeScene() {
        const plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 10 }, this.parentView.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.parentView.scene);
        material.diffuseTexture = new BABYLON.Texture("main/res/yu-gi-oh-battlefield.png", this.parentView.scene);
        material.hasAlpha = true;
        material.useAlphaFromDiffuseTexture = true;
        plane.material = material;
        plane.position.y = 0;
        plane.rotation.x = Math.PI / 2;
        switch(this.role) {
            case Role.PLAYER1:
                this.parentView.camera.position = Constants.P1_POS;
                break;
            case Role.PLAYER2:
                this.parentView.camera.position = Constants.P2_POS;
                break;
            case Role.SPECTATOR:
                this.parentView.camera.position = Constants.SPEC_POS;
                break;
        }
        this.parentView.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    }

    overlayText(text, time = 3000) {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = text;
        textBlock.color = "white";
        textBlock.fontSize = 48;
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(textBlock);
        
        setTimeout(() => {
            advancedTexture.dispose();
        }, time);
    }

    Log(string) {
        console.log("GAMEVIEW: " + string);
    }
}

export { GameView };