import { BaseView } from "../BaseView.js";

const canvas = document.getElementById("renderCanvas"); 

class RootView extends BaseView {
    
    _initialize() {
        this._log("This view is " + this.viewId + " with model " + this.model.id.substring(this.model.id.length - 2));
    }

    _subscribeAll() {
        //this.subscribe(this.viewId, "reload", this.reload);
    }

    _initializeScene() {
        //ENGINE
        this.engine = new BABYLON.Engine(canvas, true);

        //SCENE
        if (this.sharedComponents.scene === null) this.sharedComponents.scene = new BABYLON.Scene(this.engine);
        this.sharedComponents.scene.clearColor = new BABYLON.Color3.Black;
        
        //CAMERA
        if (this.sharedComponents.camera === null) this.sharedComponents.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.7, -1), this.sharedComponents.scene);
        this.sharedComponents.camera.minZ = 0.01;
        this.sharedComponents.camera.attachControl(canvas, true);
        
        //LIGHT
        if (this.sharedComponents.light === null) this.sharedComponents.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        this.sharedComponents.light.intensity = 1;
        
        //GUI MANAGER
        if (this.sharedComponents.GUIManager === null) this.sharedComponents.GUIManager = new BABYLON.GUI.GUI3DManager(this.sharedComponents.scene);
        this.sharedComponents.GUIManager.useRealisticScaling = true;
        
        //SCENE OBJECTS
        const nearMenu = new BABYLON.GUI.NearMenu("Join Menu");
        const button = new BABYLON.GUI.TouchHolographicButton("Join");
        button.text = "Join Game";
        button.onPointerDownObservable.add(() => {
            nearMenu.removeControl(button);
            this.sharedComponents.GUIManager.removeControl(nearMenu);
            // this.gameView = new GameView(this.model.gameModel, this);
            // this.children.push(this.gameView);
            console.log("CREAZIONE GAMEVIEW");
        });
        this.sharedComponents.GUIManager.addControl(nearMenu);
        nearMenu.addButton(button);
        this.sceneObjects.push(nearMenu);

        //XR
        this.activateRenderLoop();
    }

    activateRenderLoop() {
        this.createWebXRExperience().then(sceneToRender => {
            this.engine.runRenderLoop(() => sceneToRender.render());
        });
    }

    async createWebXRExperience() {
        const supported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');
        let xrHelper;
        if (supported) {
            console.log("IMMERSIVE AR SUPPORTED");
            xrHelper = await this.sharedComponents.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                    referenceSpaceType: "local-floor"
                }
            });
        } else {
            console.log("IMMERSIVE VR SUPPORTED");
            xrHelper = await this.sharedComponents.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-vr',
                }
            });
        }
        
        try {
            xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", { xrInput: xr.input });
        } catch (err) {
            console.log("Articulated hand tracking not supported in this browser.");
        }
        
        xrHelper.baseExperience.camera.setTransformationFromNonVRCamera();
        return this.sharedComponents.scene;
    }
}

export { RootView };