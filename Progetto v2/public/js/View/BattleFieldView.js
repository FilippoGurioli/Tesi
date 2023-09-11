import { BaseView } from "../BaseView.js";
import { Cards, Constants } from "../Utils/Constants.js";

class BattleFieldView extends BaseView {

    _subscribeAll() {
        this.subscribe(this.model.id, "placeCard", this.placeCard);
    }

    _initializeScene() {
        this.plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 5 }, this.sharedComponents.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.sharedComponents.scene);
        material.diffuseTexture = new BABYLON.Texture("https://cdn.discordapp.com/attachments/1150769991902314589/1150770531814096936/battlefield.png", this.sharedComponents.scene);
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

    _endScene() {
        const fadeOutAnimation = new BABYLON.Animation(
            "fadeOutAnimation",
            "visibility",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        const fadeOutKeys = [
            { frame: 0, value: 1 },
            { frame: 60, value: 0 }
        ];
        
        fadeOutAnimation.setKeys(fadeOutKeys);
        this.plane.animations.push(fadeOutAnimation);
        this.sharedComponents.scene.beginAnimation(this.plane, 0, 60, false);

        return 5000;
    }

    placeCard(data) {
        const card = Cards.find(c => c.id === data.id);
        if (!card) throw Error("Card not found");
        if (data.player === 1) {
            switch(data.position) {
                case 0:
                    if (card.type === "monster") {
                        console.log(Constants.P1_BF_MONSTER1);
                    } else {
                        console.log(Constants.P1_BF_SPELL1);
                    }
                case 1:
                case 2:
                case 3:
                case 4:    
            }
        }
    }
}

export { BattleFieldView };