import { BaseView } from "./BaseView.js";

const canvas = document.getElementById("renderCanvas");

class RootView extends BaseView {

    
    _initialize() {
        this._log("VIEW subscribed");
    }
    
    _initializeScene() {
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3.Black;
        /*
        const alpha = -Math.PI / 2;//Math.PI/4;
        const beta = Math.PI / 2;
        const radius = 2;
        const target = new BABYLON.Vector3(0, 0, 0);*/
        
        //const camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, target, this.scene);//camera that can be rotated around a target
        this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.7, -0.3), this.scene);
        this.camera.minZ = 0.01;
        this.camera.attachControl(canvas, true);
        
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        light.intensity = 1;
        
        this.GUIManager = new BABYLON.GUI.GUI3DManager(this.scene);
        this.GUIManager.useRealisticScaling = true;
        
        this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2, segments: 32}, this.scene);
        this.sphere.position = new BABYLON.Vector3(0, 1.2, 0.5); //new BABYLON.Vector3(0, 1.3, 1);
        
        const material = new BABYLON.StandardMaterial("material", this.scene);
        material.diffuseColor = BABYLON.Color3.White();
        
        this.sphere.material = material;
        
        
        //CHANGE COLOR MENU
        
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
        this.GUIManager.addControl(nearMenu);
        nearMenu.isPinned = true;
        nearMenu.position = new BABYLON.Vector3(-0.2, 1.2, 0.5);
        
        buttonParams.forEach(input => {
            const button = new BABYLON.GUI.TouchHolographicButton();
            button.text = input.name;
            button.onPointerDownObservable.add(() => {
                this.notifyColorButtonClicked(input.name);
            });
            
            nearMenu.addButton(button);
        });
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
            const xrHelper = await this.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                    referenceSpaceType: "local-floor"
                }
            });
        } else {
            console.log("IMMERSIVE VR SUPPORTED")
            const xrHelper = await this.scene.createDefaultXRExperienceAsync({
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
        
        return this.scene;
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