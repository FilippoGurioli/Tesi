import { BaseView } from "../BaseView.js";
import { Constants } from "../Utils/Constants.js";
import { TurnView } from "./TurnView.js";

class GameView extends BaseView {
    
    #opponentRecovered = false;

    #resumeInfo = "";
    counter = 0;
    
    _subscribeAll() {
        this.subscribe(this.viewId, "join-response", this.setPosition);
        this.subscribe(this.viewId, "opponent-left", () => this.wait("Opponent disconnected...", "Opponent reconnected!"));
        this.subscribe(this.viewId, "opponent-recover", () => this.#opponentRecovered = true);
        this.subscribe(this.model.turnModel.id, "changeTurn", this.changeTurn);
        this.subscribe(this.model.turnModel.id, "nextPhase", this.nextPhase);
        this.subscribe(this.model.id, "game-over", this.gameOver);
    }
    
    _initialize() {
        this.publish(this.model.id, "join", {view: this.viewId});
    }

    _initializeScene() {
        this.slate = new BABYLON.GUI.HolographicSlate("slate");
    
        this.slate.titleBarHeight = 0;
        this.sharedComponents.GUIManager.addControl(this.slate);
        this.slate.dimensions = new BABYLON.Vector2(15, 11);
        this.slate.node.position = new BABYLON.Vector3(-8, 8, 0);
        
        const contentGrid = new BABYLON.GUI.Grid("grid");
        this.title = new BABYLON.GUI.TextBlock("title");
        this.text = new BABYLON.GUI.TextBlock("text");

        this.title.height = 0.2;
        this.title.color = "white";
        this.title.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
        this.title.setPadding("5%", "5%", "5%", "5%");
        this.title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.title.fontWeight = "bold";
        this.title.fontSize = 70;

        this.text.height = 0.8;
        this.text.color = "white";
        this.text.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
        this.text.setPadding("5%", "5%", "5%", "5%");
        this.text.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.text.fontSize = 50;

        contentGrid.addControl(this.title);
        contentGrid.addControl(this.text);
        contentGrid.background = "#000080";
        this.slate.content = contentGrid;

        //! TMP: carta davanti al p1
        // this.plane = BABYLON.MeshBuilder.CreatePlane("card", { size: 1 }, this.parentView.scene);
        // const material = new BABYLON.StandardMaterial("planeMaterial", this.parentView.scene);
        // const textureFront = new BABYLON.Texture("main/res/dark-magician.webp", this.parentView.scene);
        // const textureBack = new BABYLON.Texture("main/res/card-back.png", this.parentView.scene);

        // material.diffuseTexture = textureFront;
        // material.backFaceCulling = false; // Abilita il rendering delle facce posteriori

        // this.plane.material = material;

        // // Assegna la texture alla faccia posteriore
        // this.plane.onBeforeRenderObservable.add(() => {
        //     if (this.parentView.scene.activeCamera.isReady()) {
        //         material.diffuseTexture = this.parentView.scene.activeCamera.position.z > this.plane.position.z ? textureBack : textureFront;
        //     }
        // });
        // this.plane.position.y = 1;

        this.sceneObjects.push(contentGrid, this.text, this.title, this.slate);
    }

    setPosition(data) {
        this.title.text = data.role.toUpperCase();
        if (data.role === "Player 1") {
            this.sharedComponents.camera.position = Constants.P1_POS;
            this.slate.node.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            if (!this.model.playersInfo.p2.isConnected) {
                this.wait("Waiting for Player 2...", "", true);
            } else {
                this.#gameStart();
            }
        } else if (data.role === "Player 2") {
            this.sharedComponents.camera.position = Constants.P2_POS;
            this.slate.node.rotation = new BABYLON.Vector3(0, 0, 0);
            this.#gameStart();
        } else {
            this.sharedComponents.camera.position = Constants.SPEC_POS;
            this.slate.node.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
            this.title.text = this.title.text.substring(2); //needed to remove the "a" in "a Spectator"
            this.#gameStart();
        }
        this.sharedComponents.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        this.sharedComponents.xrCamera.setTransformationFromNonVRCamera(this.sharedComponents.camera);
    }

    wait(reason, finalSentence, waitingForP2 = false) {
        //this.turnView?.discardUncoverableObjects();
        this.resumeInfo = this.text.text;
        this.text.text = reason;

        this.waiting(finalSentence, waitingForP2);
    }

    waiting(finalSentence, waitingForP2) {
        if (this.#opponentRecovered) {
            this.#opponentRecovered = false;
            this.#gameResume();
            //this.turnView?.restoreUncoverableObjects();
            if (waitingForP2)   this.#gameStart();
            return;
        } else if (this.emergencyExit) {
            this.emergencyExit = false;
            return;
        }
        this.future(500).waiting(finalSentence, waitingForP2);
    }

    gameOver(reason) {
        this.emergencyExit = true; //esce dalla wait
        //this.turnView.discardUncoverableObjects();
        this.text.text = "Game Over\n" + reason;
        this.endScene();
    }

    endScene() {
        //this.BFView.plane.visibility -= 0.01;
        //if (this.BFView.plane.visibility > 0) this.future(100).endScene();
        this.counter++;
        if (this.counter < 60) this.future(100).endScene();
        else {
            this.publish(this.viewId, "reload"); //view that generates the event must be one
            this.future(500).detach(); //tempo di sicurezza per il reload
        }
    }

    changeTurn(data) {
        let rest = this.text.text.split("\n").slice(1).join("\n");
        const currentPlayerInfo = this.model.playersInfo;

        let textToShow = "";

        if (data.view === this.viewId) {
            textToShow = "YOUR TURN";
        } else if (this.viewId === currentPlayerInfo.p1.viewId || this.viewId === currentPlayerInfo.p2.viewId) {
            textToShow = "OPPONENT'S TURN";
        } else {
            if (data.view === currentPlayerInfo.p1.viewId) {
                textToShow = "PLAYER1'S TURN";
            } else if (data.view === currentPlayerInfo.p2.viewId) {
                textToShow = "PLAYER2'S TURN";
            }
        }

        this.text.text = textToShow + "\n" + rest;
        this.#resumeInfo = this.text.text;
    }

    #gameStart() {
        this.text.text = "TURN\n";
        this.text.text += "PHASE";
        this.changeTurn({view: this.model.playersInfo.p1.viewId});

        this.turnView = new TurnView({model: this.model.turnModel, parent: this, myTurn: this.viewId === this.model.playersInfo.p1.viewId});
        this.children.push(this.turnView);
        // this.BFView = new BattleFieldView(this.model.battleFieldModel, this);
        // if (this.viewId === this.model.playersInfo.p1.viewId)      this.LPView = new LifePointsView(this.model.player1.lifePoints, this);
        // else if (this.viewId === this.model.playersInfo.p2.viewId) this.LPView = new LifePointsView(this.model.player2.lifePoints, this);
    }

    #gameResume() {
        this.text.text = this.#resumeInfo;
    }
}

export { GameView };