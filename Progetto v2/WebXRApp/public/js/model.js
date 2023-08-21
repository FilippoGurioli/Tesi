class RootModel extends Croquet.Model {

    /**
     * Initialize the Model.
     * */
    init() {
        this.linkedViews = [];
        // this.isUserManipulating = false;
        // this.viewInControl = null;


        this.sphereColor = "white";

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop)
        this.subscribe("colorButton", "clicked", this.changeHologramColor);
        // this.subscribe("controlButton", "clicked", this.manageUserHologramControl);
        // this.subscribe("controlButton", "released", this.manageUserHologramControlReleased);
        // this.subscribe("hologram", "positionChanged", this.updatePosition);
        // this.subscribe("hologram", "rotationChanged", this.updateRotation);
        // this.subscribe("hologram", "scaleChanged", this.updateScale);

        // this.#initializeScene();
        // this.#activateRenderLoop();
    }
    
    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId){
        console.log("MODEL: received view join");
        this.linkedViews.push(viewId);
        //console.log("Is user manipulating " + this.isUserManipulating);
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId){
        console.log("MODEL: received view left");
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
        // if(this.viewInControl === viewId){
        //     this.isUserManipulating = false;
        //     this.linkedViews.forEach(v => this.publish(v, "showManipulatorMenu"));
        // }
    }

    /**
     * Change the color of the hologram.
     * @param {any} data object containing the color to apply.
     */
    changeHologramColor(data){
        console.log("MODEL: receive color button clicked");
        console.log(data);
        this.sphereColor = this.#computeColor(data.color);
    }

    #computeColor(colorName){
        switch (colorName) {
            case "Blue":
                return "blue";
                break;
            case "Red":
                return "red";
                break;
            case "Green":
                return "green";
                break;
            case "Purple":
                return "purple";
                break;
            case "Yellow":
                return "yellow";
                break;
            case "Teal":
                return "teal";
                break;
            default:
                return "white";
        }
    }


    // /**
    //  * Update hologram position.
    //  * @param {any} data object containing the position information.
    //  */
    // updatePosition(data){
    //     console.log("MODEL: received position changed");
    //     this.sphere.position = new BABYLON.Vector3(data.position_x, data.position_y, data.position_z);
    // }

    // /**
    //  * Update hologram rotation.
    //  * @param {any} data object containing the rotation information.
    //  */
    // updateRotation(data){
    //     console.log("MODEL: received rotation changed");
    //     this.sphere.rotationQuaternion = new BABYLON.Quaternion(data.rotation_x, data.rotation_y, data.rotation_z, data.rotation_w);
    // }

    // /**
    //  * Update hologram scale.
    //  * @param {any} data object containing the scale infromation.
    //  */
    // updateScale(data){
    //     console.log("MODEL: received scale changed");
    //     this.sphere.scaling = new BABYLON.Vector3(data.scale_x, data.scale_y, data.scale_z);
    // }

    // /**
    //  * Manage the control of the hologram from the user.
    //  * @param {any} data object that contains the id of the view in control.
    //  */
    // manageUserHologramControl(data){
    //     console.log("MODEL: received manage user hologram control");
    //     this.isUserManipulating = true;
    //     this.viewInControl = data.view;
    //     this.linkedViews.filter(v => data.view !== v).forEach(v => this.publish(v, "hideManipulatorMenu"));
    // }

    // /**
    //  * Manage the relase of the control from the user who had it.
    //  * @param {any} data object that contains the id of the view where the user released the control.
    //  */
    // manageUserHologramControlReleased(data){
    //     console.log("MODEL: received manage user hologram control");
    //     this.isUserManipulating = false;
    //     this.linkedViews.filter(v => data.view !== v).forEach(v => this.publish(v, "showManipulatorMenu"));
    // }


    // #initializeScene(){
    //     this.engine = new BABYLON.Engine(canvas, true);
    //     this.scene = new BABYLON.Scene(this.engine);
    //     this.scene.clearColor = new BABYLON.Color3.Black;
    //     /*
    //     const alpha = -Math.PI / 2;//Math.PI/4;
    //     const beta = Math.PI / 2;
    //     const radius = 2;
    //     const target = new BABYLON.Vector3(0, 0, 0);*/

    //     //const camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, target, this.scene);//camera that can be rotated around a target
    //     var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.7, -0.3), this.scene);
    //     camera.minZ = 0.01;
    //     camera.attachControl(canvas, true);

    //     const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    //     light.intensity = 1;

    //     this.GUIManager = new BABYLON.GUI.GUI3DManager(this.scene);
    //     this.GUIManager.useRealisticScaling = true;

    //     this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2, segments: 32}, this.scene);
    //     this.sphere.position = new BABYLON.Vector3(0, 1.2, 0.5); //new BABYLON.Vector3(0, 1.3, 1);

    //     const material = new BABYLON.StandardMaterial("material", this.scene);
    //     material.diffuseColor = BABYLON.Color3.White();

    //     this.sphere.material = material;
    // }

    // async #createWebXRExperience() {
    //     const supported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar')

    //     if (supported) {
    //         console.log("IMMERSIVE AR SUPPORTED");
    //         const xrHelper = await this.scene.createDefaultXRExperienceAsync({
    //             uiOptions: {
    //                 sessionMode: 'immersive-ar',
    //                 referenceSpaceType: "local-floor"
    //             }
    //         });
    //     } else {
    //         console.log("IMMERSIVE VR SUPPORTED")
    //         const xrHelper = await this.scene.createDefaultXRExperienceAsync({
    //             uiOptions: {
    //                 sessionMode: 'immersive-vr',
    //             }
    //         });
    //     }

    //     try {
    //         xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", { xrInput: xr.input });
    //     } catch (err) {
    //         console.log("Articulated hand tracking not supported in this browser.");
    //     }

    //     return this.scene;
    // }

    // #activateRenderLoop() {
    //     this.#createWebXRExperience().then(sceneToRender => {
    //         this.engine.runRenderLoop(() => sceneToRender.render());
    //     });
    // }

}


RootModel.register("RootModel");


export { RootModel };