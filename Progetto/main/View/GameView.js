import { Constants } from "../Utils/Constants.js";
import { TurnView } from "./TurnView.js";
import { LifePointsView } from "./LifePointsView.js";

class GameView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log(this.viewId + " created.");
        
        this.subscribe(this.viewId, "join-response", this.initializeScene);
        this.subscribe(this.viewId, "opponent-left", () => this.wait("Opponent disconnected...", "Opponent reconnected!"));
        this.subscribe(this.viewId, "opponent-recover", () => this.opponentRecovered = true);
        this.subscribe(this.model.id, "game-over", this.gameOver);


        this.publish(this.model.id, "join", this.viewId);
    }

    initializeScene(role) {
        this.overlay = new BABYLON.GUI.Rectangle();
        this.overlay.width = "100%";
        this.overlay.height = "100%";
        this.overlay.background = "black";
        this.overlay.alpha = 0.5;
        this.overlay.isPointerBlocker = true; // Impedisce interazioni con gli oggetti sottostanti

        this.plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 5 }, this.parentView.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.parentView.scene);
        material.diffuseTexture = new BABYLON.Texture("main/res/yu-gi-oh-battlefield.png", this.parentView.scene);
        material.diffuseTexture.hasAlpha = true;
        this.plane.material = material;
        this.plane.position.y = -1;
        this.plane.rotation.x = Math.PI / 2;
        if (role === "Player 1") {
            this.parentView.camera.position = Constants.P1_POS;
            if (!this.model.players.p2.isConnected) {
                this.wait("Waiting for Player 2...", "Player 2 joined", true);
            } else {
                this.#gameStart(role);
            }
        } else if (role === "Player 2") {
            this.parentView.camera.position = Constants.P2_POS;
            this.#gameStart(role);
        } else {
            this.parentView.camera.position = Constants.SPEC_POS;
            this.#gameStart(role);
        }
        this.parentView.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    }

    wait(reason, finalSentence, waitingForP2 = false) {
        this.turnView?.discardUncoverableObjects();
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = reason;
        textBlock.color = "white";
        textBlock.fontSize = 48;
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(this.overlay);
        advancedTexture.addControl(textBlock);


        this.waiting(finalSentence, waitingForP2, advancedTexture, textBlock);
    }

    waiting(finalSentence, waitingForP2, advancedTexture, textBlock) {
        if (this.opponentRecovered) {
            advancedTexture.dispose();
            this.overlayText(finalSentence, 1000);
            this.opponentRecovered = false;
            this.turnView?.restoreUncoverableObjects();
            if (waitingForP2)   this.#gameStart("Player 1");
            return;
        } else if (this.emergencyExit) {
            this.emergencyExit = false;
            textBlock.text = "";
            return;
        }
        this.future(500).waiting(finalSentence, waitingForP2, advancedTexture, textBlock);
    }

    gameOver(reason) {
        this.emergencyExit = true; //esce dalla wait
        this.turnView.discardUncoverableObjects();
        this.overlayText("Game Over\n" + reason, 6000);
        this.endScene();
    }

    endScene() {
        this.overlay.alpha += 0.01;
        if (this.overlay.alpha < 1) this.future(100).endScene();
        else {
            this.publish(this.sessionId, "reload"); //per ora non ascoltato da nessuno
            this.future(5000).detach();
        }
    }

    getPlayer() {
        return this.viewId === this.model.players.p1.viewId ? 1 : this.viewId === this.model.players.p2.viewId ? 2 : 0;
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

    detach() {
        super.detach();
        this.plane.dispose();
        this.overlay.dispose();
        this.turnView.detach();
        this.LPViewP1.detach();
        this.LPViewP2.detach();
        this.Log(this.viewId + " detached.");
    }

    Log(string) {
        console.log("GAMEVIEW: " + string);
    }

    #gameStart(role) {
        this.overlayText("You are " + role);
        
        this.turnView = new TurnView(this.model.turnModel, this);
        this.LPViewP1 = new LifePointsView(this.model.players.p1.lifePoints, this);
        this.LPViewP2 = new LifePointsView(this.model.players.p2.lifePoints, this);
    }
}

export { GameView };