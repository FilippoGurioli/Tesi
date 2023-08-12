import { Constants } from "../Utils/Constants.js";
import { TurnView } from "./TurnView.js";
import { LifePointsView } from "./LifePointsView.js";

class GameView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.Log("Created.");

        this.#initializeScene();
        
        this.subscribe(this.viewId, "join-response", this.setPosition);
        this.subscribe(this.viewId, "opponent-left", () => this.wait("Opponent disconnected...", "Opponent reconnected!"));
        this.subscribe(this.viewId, "opponent-recover", () => this.opponentRecovered = true);
        this.subscribe(this.model.id, "game-over", this.gameOver);


        this.publish(this.model.id, "join", this.viewId);

        this.wordsToStamp = [];
        this.stampOverlayText();
    }

    #initializeScene() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.textBlock = new BABYLON.GUI.TextBlock();
        this.textBlock.color = "white";
        this.textBlock.fontSize = 48;
        this.textBlock.text = "";
        this.textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        
        this.overlay = new BABYLON.GUI.Rectangle();
        this.overlay.width = "100%";
        this.overlay.height = "100%";
        this.overlay.background = "black";
        this.overlay.alpha = 0;

        this.advancedTexture.addControl(this.overlay);
        this.advancedTexture.addControl(this.textBlock);
        
        this.plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 5 }, this.parentView.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.parentView.scene);
        material.diffuseTexture = new BABYLON.Texture("main/res/yu-gi-oh-battlefield.png", this.parentView.scene);
        material.diffuseTexture.hasAlpha = true;
        this.plane.material = material;
        this.plane.position.y = -1;
        this.plane.rotation.x = Math.PI / 2;
    }

    setPosition(role) {
        if (role === "Player 1") {
            this.parentView.camera.position = Constants.P1_POS;
            if (!this.model.players.p2.isConnected) {
                this.wait("Waiting for Player 2...", "", true);
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
        this.textBlock.text = reason;
        this.overlay.alpha = 0.5;

        this.waiting(finalSentence, waitingForP2);
    }

    waiting(finalSentence, waitingForP2) {
        if (this.opponentRecovered) {
            this.textBlock.text = "";
            this.overlay.alpha = 0;
            this.overlayText(finalSentence, 1000);
            this.opponentRecovered = false;
            this.turnView?.restoreUncoverableObjects();
            if (waitingForP2)   this.#gameStart("Player 1");
            return;
        } else if (this.emergencyExit) {
            this.emergencyExit = false;
            this.textBlock.text = "";
            return;
        }
        this.future(500).waiting(finalSentence, waitingForP2);
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
            this.publish(this.viewId, "reload"); //view that generates the event must be one
            this.future(500).detach(); //tempo di sicurezza per il reload
        }
    }

    overlayText(text, time = 3000) {
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.color = "white";
        textBlock.fontSize = 48;
        textBlock.text = text;
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.wordsToStamp.push({text:textBlock, time:time});
    }

    stampOverlayText() {
        if (this.wordsToStamp.length > 0) {
            this.advancedTexture.addControl(this.wordsToStamp[0].text);
            this.future(this.wordsToStamp[0].time).destroyOverlayText();
        } else {
            this.future(500).stampOverlayText();
        }
    }

    destroyOverlayText() {
        this.advancedTexture.removeControl(this.wordsToStamp[0].text);
        this.wordsToStamp.shift();
        this.stampOverlayText();
    }

    detach() {
        super.detach();
        this.plane.dispose();
        this.overlay.dispose();
        this.textBlock.dispose();
        this.advancedTexture.dispose();
        this.turnView.detach();
        this.LPViewP1.detach();
        this.LPViewP2.detach();
        this.Log("Detached.");
    }

    Log(string) {
        console.log("GAMEVIEW: " + string);
    }

    #gameStart(role) {
        this.overlayText("You are " + role, 1000);

        this.turnView = new TurnView(this.model.turnModel, this);
        this.LPViewP1 = new LifePointsView(this.model.players.p1.lifePoints, this);
        this.LPViewP2 = new LifePointsView(this.model.players.p2.lifePoints, this);
    }

    get scene() {
        return this.parentView.scene;
    }
}

export { GameView };