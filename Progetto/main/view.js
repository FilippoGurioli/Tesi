import { Role } from "./Model/Role.js";

const canvas = document.getElementById("renderCanvas");

class RootView extends Croquet.View {

    /**
    * Constructor for the class.
    * @param {any} model the model of reference
    */
    constructor(model) {
        super(model);
        this.model = model;
        this.#initializeScene();
        this.#activateRenderLoop();
        
        this.Log("View " + this.viewId + " created from model " + this.model.id + ".");
        
        this.#setRole();

        this.subscribe(this.model.turnModel.id, "changeTurn", this.changeTurn);

        new TurnView(this.model.turnModel, this);
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
        if (this.model.players.p1 === this.viewId) {
            this.role = Role.PLAYER1;
            this.overlayText("You are Player 1", 3000);
        } else if (this.model.players.p2 === this.viewId) {
            this.role = Role.PLAYER2;
            this.overlayText("You are Player 2", 3000);
        } else {
            this.role = Role.SPECTATOR;
            this.overlayText("You are a Spectator", 3000);
        }
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
        console.log("VIEW: " + string);
    }

    //----------------------Anna Vitali----------------------
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

class TurnView extends Croquet.View {

    constructor(model, parentView) {
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.turnMenu = null;
        if (this.parentView.role === Role.PLAYER1 && this.model.turn.turn % 2 === 1
                                                  ||
            this.parentView.role === Role.PLAYER2 && this.model.turn.turn % 2 === 0) {
            this.#addMenu();
        }
        this.subscribe(this.model.id, "changeTurn", this.changeTurn);
    }

    changeTurn(viewId) {
        if (viewId === this.viewId) {
            this.#addMenu();
        } else {
            this.turnMenu?.dispose();
        }
    }

    #addMenu() {
        this.turnMenu = new BABYLON.GUI.NearMenu("TurnMenu");
        this.turnMenu.position = new BABYLON.Vector3(0, 0, 1);
        this.button = new BABYLON.GUI.TouchHolographicButton();
        this.button.text = "Next phase";
        this.button.onPointerDownObservable.add(() => {
            this.publish(this.model.id, "nextPhase");
        });
        this.parentView.GUIManager.addControl(this.turnMenu);
        this.turnMenu.addButton(this.button);
    }

    Log(string) {
        console.log("TURNVIEW: " + string);
    }
}