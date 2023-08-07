import { Turn } from "./Model/Turn.js";
import { Phase } from "./Model/Phase.js";

const canvas = document.getElementById("renderCanvas");

class RootModel extends Croquet.Model {

    players = {p1: "", p2: ""};

    turn = new Turn();

    connectedViews = [];

    /**
    * Initialize the Model.
    * */
    init() {
        //TODO: this.subscribe();
        this.Log(this.id + " created.");

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);
        this.subscribe("nextPhase", "clicked", this.nextPhase);

        this.#initializeScene();
        this.#activateRenderLoop();
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId) {
        this.connectedViews.push(viewId);
        this.Log("view " + viewId + " joined.");
        if (this.players.p1 === "") {
            this.players.p1 = viewId;
        } else if (this.players.p2 === "") {
            this.players.p2 = viewId;
        }
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId) {
        this.connectedViews = this.connectedViews.splice(this.connectedViews.indexOf(viewId), 1);
        this.Log("view " + viewId + " left.");
        if (this.players.p1 === viewId) {
            this.players.p1 = "";
        } else if (this.players.p2 === viewId) {
            this.players.p2 = "";
        }
        if(this.connectedViews.length === 0) {
            this.destroy();
        }
    }

    //TODO: Metodi pubblici per la sottoscrizione agli eventi
    nextPhase() {
        this.turn.nextPhase();
        this.Log("TURN: " + this.turn);
        if (this.turn.phase === Phase.DrawPhase) {
            this.publish(this.id, "changeTurn", this.turn.turn % 2 === 0 ? this.players.p2 : this.players.p1);
        }
    }

    #initializeScene() {
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3.Black;
        
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.7, -0.3), this.scene);
        camera.minZ = 0.01;
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        light.intensity = 1;
        
        this.GUIManager = new BABYLON.GUI.GUI3DManager(this.scene);
        this.GUIManager.useRealisticScaling = true;

        //TODO: qui inizializzare gli oggetti della scena condivisi tra i 2 giocatori
    }

    async #createWebXRExperience() {
        const supported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar')

        if (supported) {
            this.Log("IMMERSIVE AR SUPPORTED");
            const xrHelper = await this.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                    referenceSpaceType: "local-floor"
                }
            });
        } else {
            this.Log("IMMERSIVE VR SUPPORTED")
            const xrHelper = await this.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-vr',
                }
            });
        }

        try {
            xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", { xrInput: xr.input });
            xrHelper.baseExperience.camera.position = new BABYLON.Vector3(0, 0, -0.3);
        } catch (err) {
            this.Log("Articulated hand tracking not supported in this browser.");
        }

        return this.scene;
    }

    #activateRenderLoop() {
        this.#createWebXRExperience().then(sceneToRender => {
            this.engine.runRenderLoop(() => sceneToRender.render());
        });
    }

    Log(string) {
        console.log("MODEL: " + string);
    }
}

RootModel.register("RootModel");


export { canvas, RootModel };