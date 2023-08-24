import { BaseView } from "../BaseView.js";
import { Constants } from "../Utils/Constants.js";

class GameView extends BaseView {
    
    #wordsToStamp = [];
    #opponentRecovered = false;
    
    _subscribeAll() {
        this.subscribe(this.viewId, "join-response", this.setPosition);
        this.subscribe(this.viewId, "opponent-recover", () => this.#opponentRecovered = true)
    }
    
    _initialize() {
        this.publish(this.model.id, "join", {view: this.viewId});
    }

    _initializeScene() {
        this.slate = new BABYLON.GUI.HolographicSlate("Info point");
        this.sharedComponents.GUIManager.addControl(this.slate);
        //slate.minDimensions = new BABYLON.Vector2(50, 50);
        this.slate.dimensions = new BABYLON.Vector2(50, 50);
        this.slate.titleBarHeight = 3;
        this.slate.title = "PLAYER 1 INFO";
        this.slate.position = new BABYLON.Vector3(43, 83, 0);
        
        this.textBlock = new BABYLON.GUI.TextBlock(); //textBlock.text has to be modified during all the game (need the reference)
        this.textBlock.width = 0.75;
        this.textBlock.height = 0.55;
        this.textBlock.color = "white";
        this.textBlock.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
        this.textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.textBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.textBlock.text = "";
        
        const grid = new BABYLON.GUI.Grid("Grid");
        grid.background = "#000080";
        grid.addControl(this.textBlock);
        this.slate.content = grid;

        this.overlay = new BABYLON.GUI.Rectangle();
        this.overlay.width = "100%";
        this.overlay.height = "100%";
        this.overlay.background = "black";
        this.overlay.alpha = 0;
        
        //! TMP: carta davanti al p1
        this.plane = BABYLON.MeshBuilder.CreatePlane("card", { size: 1 }, this.sharedComponents.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.sharedComponents.scene);
        const textureFront = new BABYLON.Texture("img/dark-magician.webp", this.sharedComponents.scene);
        const textureBack = new BABYLON.Texture("img/card-back.png", this.sharedComponents.scene);
        
        material.diffuseTexture = textureFront;
        material.backFaceCulling = false; // Abilita il rendering delle facce posteriori
        
        this.plane.material = material;
        
        // Assegna la texture alla faccia posteriore
        this.plane.onBeforeRenderObservable.add(() => {
            if (this.sharedComponents.scene.activeCamera.isReady()) {
                material.diffuseTexture = this.sharedComponents.scene.activeCamera.position.z > this.plane.position.z ? textureBack : textureFront;
            }
        });
        this.plane.position = new BABYLON.Vector3(0,0,0);
        this.plane.rotation.x = Math.PI / 2;
        
        this.sceneObjects.push(this.textBlock, this.overlay, this.plane, grid, this.slate);
    }

    _update() {
        console.log("POSITION: " + this.slate.position);
    }

    setPosition(data) {
        if (data.role === "Player 1") {
            this.sharedComponents.camera.position = Constants.P1_POS;
            if (!this.model.playersInfo.p2.isConnected) {
                this.wait("Waiting for Player 2...", "", true);
            } else {
                this.#gameStart(data.role);
            }
        } else if (data.role === "Player 2") {
            this.sharedComponents.camera.position = Constants.P2_POS;
            this.#gameStart(data.role);
        } else {
            this.sharedComponents.camera.position = Constants.SPEC_POS;
            this.#gameStart(data.role);
        }
        this.sharedComponents.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        this.sharedComponents.xrCamera.setTransformationFromNonVRCamera(this.sharedComponents.camera);
    }

    wait(reason, finalSentence, waitingForP2 = false) {
        //this.turnView?.discardUncoverableObjects();
        this.textBlock.text = reason;
        this.overlay.alpha = 0.5;

        this.waiting(finalSentence, waitingForP2);
    }

    waiting(finalSentence, waitingForP2) {
        if (this.#opponentRecovered) {
            this.textBlock.text = "";
            this.overlay.alpha = 0;
            this.overlayText(finalSentence, 500);
            this.#opponentRecovered = false;
            //this.turnView?.restoreUncoverableObjects();
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
        //this.turnView.discardUncoverableObjects();
        this.overlayText("Game Over\n" + reason, 6000);
        this.endScene();
    }

    endScene() {
        //this.BFView.plane.visibility -= 0.01;
        this.plane.visibility -= 0.01;
        //if (this.BFView.plane.visibility > 0) this.future(100).endScene();
        if (this.plane.visibility > 0) this.future(100).endScene();
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
        this.#wordsToStamp.push({text:textBlock, time:time});
    }

    stampOverlayText() {
        if (this.#wordsToStamp.length > 0) {
            this.advancedTexture.addControl(this.#wordsToStamp[0].text);
            this.future(this.#wordsToStamp[0].time).destroyOverlayText();
        } else {
            this.future(500).stampOverlayText();
        }
    }

    destroyOverlayText() {
        this.advancedTexture.removeControl(this.#wordsToStamp[0].text);
        this.#wordsToStamp.shift();
        this.stampOverlayText();
    }

    #gameStart(role) {
        this.overlayText("You are " + role, 1000);

        // this.turnView = new TurnView(this.model.turnModel, this);
        // this.BFView = new BattleFieldView(this.model.battleFieldModel, this);
        // if (this.viewId === this.model.playersInfo.p1.viewId)      this.LPView = new LifePointsView(this.model.player1.lifePoints, this);
        // else if (this.viewId === this.model.playersInfo.p2.viewId) this.LPView = new LifePointsView(this.model.player2.lifePoints, this);
    }
}

export { GameView };