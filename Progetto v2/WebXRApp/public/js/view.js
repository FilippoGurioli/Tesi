const canvas = document.getElementById("renderCanvas");

class RootView extends Croquet.View {

    /**
     * Constructor for the class.
     * @param {any} model the model of reference
     */
    constructor(model) {
        super(model);
        this.model = model;

        //this.subscribe("controlButton", "clicked", this.manageUserHologramControls);
        // this.subscribe(this.viewId, "hideManipulatorMenu", this.hideManipulatorMenu);
        // this.subscribe(this.viewId, "showManipulatorMenu", this.addManipulatorMenu);

        this.#initializeScene();
        this.#activateRenderLoop();

        console.log("VIEW subscribed");
        // if(!this.model.isUserManipulating) {
        //     this.addManipulatorMenu();
        // }
    }

    update(data) {
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

    /**
     * Notify that the colored button has been clicked.
     * @param {any} colorName name of the button clicked.
     */
    notifyColorButtonClicked(colorName){
        console.log("VIEW: color button clicked");
        this.publish("colorButton", "clicked", {color: colorName});
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
    // /**
    //  * Hide the manipulator menu.
    //  * */
    // hideManipulatorMenu(){
    //     console.log("VIEW: received hide manipulator menu");
    //     this.manipulatorNearMenu.dispose();
    // }


    // /**
    //  * Notify that the current user has started manipulating the hologram.
    //  * */
    // notifyUserStartManipulating(){
    //     console.log("VIEW: user start manipulating");
    //     this.publish("controlButton", "clicked", {view: this.viewId});
    // }

    // /**
    //  * Notify that the current user has finish to manipulate the hologram.
    //  * */
    // notifyCurrentUserReleaseControl(){
    //     console.log("VIEW: user stop manipulating");
    //     this.#setDefaultControlButtonBehavior();
    //     this.#removeElementHologramManipulator();
    //     this.publish("controlButton", "released", {view: this.viewId});
    // }

    // /**
    //  * Notify that the positon of the hologram has been changed.
    //  * @param {BABYLON.Vector3} position the new position.
    //  */
    // notifyHologramPositionChanged(position){
    //     console.log("VIEW: hologram position change");
    //     this.publish("hologram", "positionChanged",
    //         {
    //             position_x: position.x,
    //             position_y: position.y,
    //             position_z: position.z
    //         });
    // }

    // /**
    //  * Notify that the rotation of the hologram has been changed.
    //  * @param {BABYLON.Quaternion} rotation the new rotation.
    //  */
    // notifyHologramRotationChanged(rotation){
    //     console.log("VIEW: hologram rotation change");
    //     this.publish("hologram", "rotationChanged",
    //         {
    //             rotation_x: rotation.x,
    //             rotation_y: rotation.y,
    //             rotation_z: rotation.z,
    //             rotation_w: rotation.w
    //         });
    // }

    // /**
    //  * Notify that the scale of the hologram has been changed.
    //  * @param {BABYLON.Vector3} scale the new scale.
    //  */
    // notifyHologramScaleChanged(scale){
    //     console.log("VIEW: hologram scale change");
    //     this.publish("hologram", "scaleChanged",
    //         {
    //             scale_x: scale.x,
    //             scale_y: scale.y,
    //             scale_z: scale.z
    //         });
    // }

    // /**
    //  * Add the menu that allow the user to manipulate the hologram.
    //  * */
    // addManipulatorMenu() {
    //     this.manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
    //     this.manipulatorNearMenu.rows = 1;
    //     this.model.GUIManager.addControl(this.manipulatorNearMenu);
    //     this.manipulatorNearMenu.isPinned = true;
    //     this.manipulatorNearMenu.position = new BABYLON.Vector3(+0.2, 1.2, 0.5);

    //     this.controlButton = new BABYLON.GUI.TouchHolographicButton();
    //     this.#setDefaultControlButtonBehavior()
    //     this.manipulatorNearMenu.addButton(this.controlButton);
    // }


    // #removeElementHologramManipulator() {
    //     this.viewSphere.dispose();
    //     this.boundingBox.dispose();
    //     this.gizmo.attachedMesh = null;
    //     this.gizmo.dispose();
    // }

    // #setDefaultControlButtonBehavior() {
    //     this.controlButton.text = "Start manipulating";
    //     this.controlButton.imageUrl = "../img/iconAdjust.png"
    //     this.controlButton.onPointerDownObservable.clear();
    //     this.controlButton.onPointerDownObservable.add(() => {
    //         this.#addHologramManipulator();
    //         this.notifyUserStartManipulating();
    //     });
    // }

    // #addHologramManipulator(){
    //     //create bounding box and object controls
    //     this.viewSphere = BABYLON.MeshBuilder.CreateSphere("viewSphere", {diameter: 0.2, segments: 32}, this.model.scene);
    //     this.viewSphere.position = new BABYLON.Vector3(this.model.sphere.absolutePosition.x, this.model.sphere.absolutePosition.y, this.model.sphere.absolutePosition.z);
    //     this.viewSphere.rotationQuaternion = new BABYLON.Quaternion(this.model.sphere.absoluteRotationQuaternion.x, this.model.sphere.absoluteRotationQuaternion.y, this.model.sphere.absoluteRotationQuaternion.z, this.model.sphere.absoluteRotationQuaternion.w);
    //     this.viewSphere.scaling = new BABYLON.Vector3(this.model.sphere.absoluteScaling.x, this.model.sphere.absoluteScaling.y, this.model.sphere.absoluteScaling.z);
    //     this.viewSphere.isVisible = false;

    //     this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.viewSphere);
    //     const utilLayer = new BABYLON.UtilityLayerRenderer(this.model.scene);
    //     utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
    //     this.gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#0984e3"), utilLayer)
    //     this.gizmo.rotationSphereSize = 0.03;
    //     this.gizmo.scaleBoxSize = 0.03;
    //     this.gizmo.attachedMesh = this.boundingBox;

    //     // Create behaviors to drag and scale with pointers in VR
    //     const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
    //     sixDofDragBehavior.dragDeltaRatio = 1;
    //     sixDofDragBehavior.zDragFactor = 1;

    //     sixDofDragBehavior.onPositionChangedObservable.add(() => {
    //         this.notifyHologramPositionChanged(this.viewSphere.absolutePosition);
    //     });
    //     this.boundingBox.addBehavior(sixDofDragBehavior);

    //     this.gizmo.onScaleBoxDragObservable.add(() => {
    //         this.notifyHologramScaleChanged(this.viewSphere.absoluteScaling);
    //     });

    //     this.gizmo.onRotationSphereDragObservable.add(() => {
    //         console.log("rotDrag");
    //         this.notifyHologramRotationChanged(this.viewSphere.absoluteRotationQuaternion);
    //     });


    //     this.controlButton.text = "Stop manipulating";
    //     this.controlButton.onPointerDownObservable.clear();
    //     this.controlButton.onPointerDownObservable.add(() => {
    //         this.notifyCurrentUserReleaseControl();
    //     });
    // }

}



export { RootView };