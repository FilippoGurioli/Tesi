import { BaseView } from "../BaseView.js";
import { Constants } from "../Utils/Constants.js";
import { TurnView } from "./TurnView.js";

class GameView extends BaseView {
    
    #opponentRecovered = false;

    #role = "";

    counter = 0;
    
    _subscribeAll() {
        this.subscribe(this.viewId, "join-response", this.setPosition);
        this.subscribe(this.viewId, "opponent-left", () => this.wait("Opponent disconnected...", "Opponent reconnected!"));
        this.subscribe(this.viewId, "opponent-recover", () => this.#opponentRecovered = true);
        this.subscribe(this.model.id, "game-over", this.gameOver);
    }
    
    _initialize() {
        this.publish(this.model.id, "join", {view: this.viewId});
    }

    _initializeScene() {

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

        //this.sceneObjects.push(contentGrid, this.text, this.title, this.slate);
    }

    setPosition(data) {
        this.#role = data.role;
        if (data.role === "Player 1") {
            this.sharedComponents.camera.position = Constants.P1_POS;
        } else if (data.role === "Player 2") {
            this.sharedComponents.camera.position = Constants.P2_POS;
        } else {
            this.sharedComponents.camera.position = Constants.SPEC_POS;
        }
        this.sharedComponents.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        this.sharedComponents.xrCamera.setTransformationFromNonVRCamera(this.sharedComponents.camera);
        this.#gameStart();
        if (!this.model.playersInfo.p2.isConnected) {
            this.wait("Waiting for Player 2...", "", true);
        }
    }

    wait(reason, finalSentence, waitingForP2 = false) {
        //this.turnView?.discardUncoverableObjects();
        this.turnView.displaySpecialMessage(reason);
        this.waiting(finalSentence, waitingForP2);
    }

    waiting(finalSentence, waitingForP2) {
        if (this.#opponentRecovered) {
            this.#opponentRecovered = false;
            this.turnView.resume();
            //this.turnView?.restoreUncoverableObjects();
            return;
        } else if (this.emergencyExit) {
            this.emergencyExit = false;
            return;
        }
        this.future(500).waiting(finalSentence, waitingForP2);
    }

    gameOver(reason) {
        this.emergencyExit = true; //exit from waiting
        //this.turnView.discardUncoverableObjects();
        this.turnView.displaySpecialMessage("Game Over\n" + reason);
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

    #gameStart() {
        this.turnView = new TurnView({model: this.model.turnModel, parent: this, role: this.#role});
        this.children.push(this.turnView);
        // this.BFView = new BattleFieldView(this.model.battleFieldModel, this);
        // if (this.viewId === this.model.playersInfo.p1.viewId)      this.LPView = new LifePointsView(this.model.player1.lifePoints, this);
        // else if (this.viewId === this.model.playersInfo.p2.viewId) this.LPView = new LifePointsView(this.model.player2.lifePoints, this);
    }

}

export { GameView };