import { Constants } from "../Utils/Constants.js";
import { TurnView } from "./TurnView.js";

class GameView extends Croquet.View {
    
    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log(this.viewId + " created.");
        this.#showRole();
        this.#initializeScene();
        new TurnView(this.model.turnModel, this);

        this.subscribe(this.model.id, "game-over", this.selfDestroy);
        this.subscribe(this.model.id, "broadcastText", (text) => this.overlayText(text));
    }

    selfDestroy() {
        this.Log(this.viewId + " destroyed.");
        this.overlayText("Game Over", 10000);
        this.detach();
    }

    getPlayer() {
        return this.viewId === this.model.players.p1.viewId ? 1 : this.viewId === this.model.players.p2.viewId ? 2 : 0;
    }

    #showRole() {
        if (this.model.players.p1.viewId === this.viewId) {
            this.overlayText("You are Player 1", 3000);
        } else if (this.model.players.p2.viewId === this.viewId) {
            this.overlayText("You are Player 2", 3000);
        } else {
            this.overlayText("You are a Spectator", 3000);
        }
    }

    #initializeScene() {
        const plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 5 }, this.parentView.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.parentView.scene);
        material.diffuseTexture = new BABYLON.Texture("main/res/yu-gi-oh-battlefield.png", this.parentView.scene);
        material.diffuseTexture.hasAlpha = true;
        plane.material = material;
        plane.position.y = -1;
        plane.rotation.x = Math.PI / 2;
        if (this.model.players.p1.viewId === this.viewId) {
            this.parentView.camera.position = Constants.P1_POS;
        } else if (this.model.players.p2.viewId === this.viewId) {
            this.parentView.camera.position = Constants.P2_POS;
        } else {
            this.parentView.camera.position = Constants.SPEC_POS;
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