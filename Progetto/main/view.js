import { Role } from "./Model/Role.js";
import { Constants } from "./Utils/Constants.js";

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
    }

    Log(string) {
        console.log("VIEW: " + string);
    }

    //----------------------Anna Vitali----------------------
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
        
        //! Dal di qui inizia la mia parte

        this.nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        this.nearMenu.position = new BABYLON.Vector3(0, 0, 1);
        this.button = new BABYLON.GUI.TouchHolographicButton();
        this.button.text = "Join Game";
        this.button.onPointerDownObservable.add(() => {
            this.nearMenu.dispose();
            new GameView(this.model.gameModel, this);
        });
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
        this.parentView.parentView.GUIManager.addControl(this.turnMenu);  //!FIX: brutto e inestendibile
        this.turnMenu.addButton(this.button);
    }

    Log(string) {
        console.log("TURNVIEW: " + string);
    }
}