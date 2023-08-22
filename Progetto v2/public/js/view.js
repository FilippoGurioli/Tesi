import { BaseView } from "./BaseView.js";

const canvas = document.getElementById("renderCanvas"); 

class RootView extends BaseView {
    
    _initialize() {
        this._log("This view is " + this.viewId);
    }

    _initializeScene() {
        //ENGINE
        this.engine = new BABYLON.Engine(canvas, true);

        //SCENE
        if (this.sharedComponents.scene === null) this.sharedComponents.scene = new BABYLON.Scene(this.engine);
        this.sharedComponents.scene.clearColor = new BABYLON.Color3.Black;
        
        //CAMERA
        if (this.sharedComponents.camera === null) this.sharedComponents.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.7, -0.3), this.sharedComponents.scene);
        this.sharedComponents.camera.minZ = 0.01;
        this.sharedComponents.camera.attachControl(canvas, true);
        
        //LIGHT
        if (this.sharedComponents.light === null) this.sharedComponents.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        this.sharedComponents.light.intensity = 1;
        
        //GUI MANAGER
        if (this.sharedComponents.GUIManager === null) this.sharedComponents.GUIManager = new BABYLON.GUI.GUI3DManager(this.sharedComponents.scene);
        this.sharedComponents.GUIManager.useRealisticScaling = true;
        
        //SCENE OBJECTS
        this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2, segments: 32}, this.sharedComponents.scene);
        this.sphere.position = new BABYLON.Vector3(0, 1.2, 0.5);
        
        const material = new BABYLON.StandardMaterial("material", this.sharedComponents.scene);
        material.diffuseColor = BABYLON.Color3.White();
        
        this.sphere.material = material;
        
        this.sceneObjects.push(this.sphere);

        
        const buttonParams = [
            { name: "Blue", color: BABYLON.Color3.Blue() },
            { name: "Red", color: BABYLON.Color3.Red() },
            { name: "Green", color: BABYLON.Color3.Green() },
            { name: "Purple", color: BABYLON.Color3.Purple() },
            { name: "Yellow", color: BABYLON.Color3.Yellow() },
            { name: "Teal", color: BABYLON.Color3.Teal() },
        ]
        
        const nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        nearMenu.rows = 3;
        this.sharedComponents.GUIManager.addControl(nearMenu);
        nearMenu.isPinned = true;
        nearMenu.position = new BABYLON.Vector3(-0.2, 1.2, 0.5);
        
        buttonParams.forEach(input => {
            const button = new BABYLON.GUI.TouchHolographicButton();
            this.sceneObjects.push(button);
            button.text = input.name;
            button.onPointerDownObservable.add(() => {
                this.notifyColorButtonClicked(input.name);
            });
            
            nearMenu.addButton(button);
        });
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
        
        if (supported) {
            console.log("IMMERSIVE AR SUPPORTED");
            const xrHelper = await this.sharedComponents.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                    referenceSpaceType: "local-floor"
                }
            });
        } else {
            console.log("IMMERSIVE VR SUPPORTED")
            const xrHelper = await this.sharedComponents.scene.createDefaultXRExperienceAsync({
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
        
        return this.sharedComponents.scene;
    }

    /**
     * Notify that the colored button has been clicked.
     * @param {any} colorName name of the button clicked.
    */
   notifyColorButtonClicked(colorName){
       this._log("color button clicked");
       this.publish("colorButton", "clicked", {color: colorName});
    }
    
    _update() {
        switch(this.model.sphereColor) {
            case "blue":
                this.sphere.material.diffuseColor = BABYLON.Color3.Blue();
                break;
            case "red":
                this.sphere.material.diffuseColor = BABYLON.Color3.Red();
                break;
            case "green":
                this.sphere.material.diffuseColor = BABYLON.Color3.Green();
                break;
            case "purple":
                this.sphere.material.diffuseColor = BABYLON.Color3.Purple();
                break;
            case "yellow":
                this.sphere.material.diffuseColor = BABYLON.Color3.Yellow();
                break;
            case "teal":
                this.sphere.material.diffuseColor = BABYLON.Color3.Teal();
                break;
            default:
                this.sphere.material.diffuseColor = BABYLON.Color3.White();
        }
    }
}

export { RootView };