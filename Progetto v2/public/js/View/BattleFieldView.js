import { BaseView } from "../BaseView.js";

class BattleFieldView extends BaseView {

    _initializeScene() {
        this.plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 5 }, this.sharedComponents.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.sharedComponents.scene);
        material.diffuseTexture = new BABYLON.Texture("img/battlefield.png", this.sharedComponents.scene);
        material.diffuseTexture.hasAlpha = true;
        this.plane.material = material;
        this.plane.position.y = -1;
        this.plane.rotation.x = Math.PI / 2;

        //Fade in animation
        this.plane.visibility = 0;
        const fadeInAnimation = new BABYLON.Animation(
            "fadeInAnimation",
            "visibility", 
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        const fadeInKeys = [
            { frame: 0, value: 0 },  
            { frame: 60, value: 1 }  
        ];
        fadeInAnimation.setKeys(fadeInKeys);
        this.plane.animations.push(fadeInAnimation);
        this.sharedComponents.scene.beginAnimation(this.plane, 0, 60, false);
        this.sceneObjects.push(this.plane);
    }

}

export { BattleFieldView };