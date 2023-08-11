import { GameView } from "./View/GameView.js";

const canvas = document.getElementById("renderCanvas");

class RootView extends Croquet.View {

    /**
    * Constructor for the class.
    * @param {any} model the model of reference
    */
    constructor(model) {
        super(model);
        this.model = model;
        this.Log(this.viewId + " created.");

        this.subscribe(this.sessionId, "reload", this.reload);

        this.#initializeScene();
        this.#activateRenderLoop();
    }

    Log(string) {
        console.log("VIEW: " + string);
    }

    #initializeScene() {
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3.Black;
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, 0), this.scene);
        this.camera.minZ = 0.01;
        this.camera.attachControl(canvas, true);
        
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        light.intensity = 1;
        
        this.GUIManager = new BABYLON.GUI.GUI3DManager(this.scene);
        this.GUIManager.useRealisticScaling = true;

        this.nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        this.nearMenu.position = new BABYLON.Vector3(0, 0, 1);
        this.nearMenu.rows = 2;
        this.button = new BABYLON.GUI.TouchHolographicButton();
        this.button.text = "Join Game";
        this.button.onPointerDownObservable.add(() => {
            this.nearMenu.removeControl(this.button);
            this.GUIManager.removeControl(this.nearMenu);
            new GameView(this.model.gameModel, this);
        });
        this.GUIManager.addControl(this.nearMenu);
        this.nearMenu.addButton(this.button);
    }

    reload() {
        this.Log("Reloading scene.");
        this.GUIManager.addControl(this.nearMenu);
        this.nearMenu.addButton(this.button);
    }

    async #createWebXRExperience() {
        const supported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar')

        if (supported) {
            const xrHelper = await this.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                    referenceSpaceType: "local-floor"
                }
            });
        } else {
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
}

export { RootView };