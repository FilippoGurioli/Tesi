const canvas = document.getElementById("renderCanvas");

class RootModel extends Croquet.Model {

    /**
    * Initialize the Model.
    * */
    init() {
        this.linkedViews = [];

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop)
        this.subscribe("colorButton", "clicked", this.changeHologramColor);

        this.#initializeScene();
        this.#activateRenderLoop();

    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId){
        console.log("MODEL: received view join");
        this.linkedViews.push(viewId);
        console.log("Is user manipulating " + this.isUserManipulating);
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId){
        console.log("MODEL: received view left");
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
        console.log(this.linkedViews);
        if(this.linkedViews.length === 0){
            this.destroy();
        }
    }

    /**
     * Change the color of the hologram.
     * @param {any} data object containing the color to apply.
     */
    changeHologramColor(data){
        console.log("MODEL: receive color button clicked");
        this.sphere.material.diffuseColor = this.#computeColor(data.color);
    }

    #computeColor(colorName){
        switch (colorName) {
            case "Blue":
                return BABYLON.Color3.Blue();
                break;
            case "Red":
                return BABYLON.Color3.Red();
                break;
            case "Green":
                return BABYLON.Color3.Green();
                break;
            case "Purple":
                return BABYLON.Color3.Purple();
                break;
            case "Yellow":
                return BABYLON.Color3.Yellow();
                break;
            case "Teal":
                return BABYLON.Color3.Teal();
                break;
            default:
                return BABYLON.Color3.White();
        }
    }

    #initializeScene(){
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3.Black;
        /*
        const alpha = -Math.PI / 2;//Math.PI/4;
        const beta = Math.PI / 2;
        const radius = 2;
        const target = new BABYLON.Vector3(0, 0, 0);*/

        //const camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, target, this.scene);//camera that can be rotated around a target
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.7, -0.3), this.scene);
        camera.minZ = 0.01;
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        light.intensity = 1;
        
        this.GUIManager = new BABYLON.GUI.GUI3DManager(this.scene);
        this.GUIManager.useRealisticScaling = true;

        this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2, segments: 32}, this.scene);
        this.sphere.position = new BABYLON.Vector3(0, 1.2, 0.5); //new BABYLON.Vector3(0, 1.3, 1);

        const material = new BABYLON.StandardMaterial("material", this.scene);
        material.diffuseColor = BABYLON.Color3.White();

        this.sphere.material = material;
    }

    async #createWebXRExperience() {
        const supported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar')

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
            xrHelper.baseExperience.camera.position = new BABYLON.Vector3(0, 0, -0.3);
        } catch (err) {
            console.log("Articulated hand tracking not supported in this browser.");
        }

        return this.scene;
    }

    #activateRenderLoop() {
        this.#createWebXRExperience().then(sceneToRender => {
            this.engine.runRenderLoop(() => sceneToRender.render());
        });
    }

}

RootModel.register("RootModel");


export { RootModel };