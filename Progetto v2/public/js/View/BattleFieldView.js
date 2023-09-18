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
        const mesh = BABYLON.MeshBuilder.CreatePlane("card", { size: 0.8 }, this.sharedComponents.scene);
        const material = new BABYLON.StandardMaterial("cardMaterial", this.sharedComponents.scene);
        material.diffuseTexture = new BABYLON.Texture(card.imageOnBF, this.sharedComponents.scene);
        material.diffuseTexture.hasAlpha = true;
        mesh.material = material;
        mesh.rotation.x = Math.PI / 2;

        mesh.position.y = 0.04;
        
        if (data.player === 1) {
            mesh.rotation.y = Math.PI;
            switch(data.position) {
                case 0:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P1_BF_MONSTER1.x;
                        mesh.position.z = Constants.P1_BF_MONSTER1.y;
                    } else {
                        mesh.position.x = Constants.P1_BF_SPELL1.x;
                        mesh.position.z = Constants.P1_BF_SPELL1.y;
                    }
                    break;
                case 1:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P1_BF_MONSTER2.x;
                        mesh.position.z = Constants.P1_BF_MONSTER2.y;
                    } else {
                        mesh.position.x = Constants.P1_BF_SPELL2.x;
                        mesh.position.z = Constants.P1_BF_SPELL2.y;
                    }
                    break;
                case 2:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P1_BF_MONSTER3.x;
                        mesh.position.z = Constants.P1_BF_MONSTER3.y;
                    } else {
                        mesh.position.x = Constants.P1_BF_SPELL3.x;
                        mesh.position.z = Constants.P1_BF_SPELL3.y;
                    }
                    break;
                case 3:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P1_BF_MONSTER4.x;
                        mesh.position.z = Constants.P1_BF_MONSTER4.y;
                    } else {
                        mesh.position.x = Constants.P1_BF_SPELL4.x;
                        mesh.position.z = Constants.P1_BF_SPELL4.y;
                    }
                    break;
                case 4:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P1_BF_MONSTER5.x;
                        mesh.position.z = Constants.P1_BF_MONSTER5.y;
                    } else {
                        mesh.position.x = Constants.P1_BF_SPELL5.x;
                        mesh.position.z = Constants.P1_BF_SPELL5.y;
                    }
                    break;
            }
        } else {
            switch(data.position) {
                case 0:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P2_BF_MONSTER1.x;
                        mesh.position.z = Constants.P2_BF_MONSTER1.y;
                    } else {
                        mesh.position.x = Constants.P2_BF_SPELL1.x;
                        mesh.position.z = Constants.P2_BF_SPELL1.y;
                    }
                    break;
                case 1:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P2_BF_MONSTER2.x;
                        mesh.position.z = Constants.P2_BF_MONSTER2.y;
                    } else {
                        mesh.position.x = Constants.P2_BF_SPELL2.x;
                        mesh.position.z = Constants.P2_BF_SPELL2.y;
                    }
                    break;
                case 2:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P2_BF_MONSTER3.x;
                        mesh.position.z = Constants.P2_BF_MONSTER3.y;
                    } else {
                        mesh.position.x = Constants.P2_BF_SPELL3.x;
                        mesh.position.z = Constants.P2_BF_SPELL3.y;
                    }
                    break;
                case 3:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P2_BF_MONSTER4.x;
                        mesh.position.z = Constants.P2_BF_MONSTER4.y;
                    } else {
                        mesh.position.x = Constants.P2_BF_SPELL4.x;
                        mesh.position.z = Constants.P2_BF_SPELL4.y;
                    }
                    break;
                case 4:
                    if (card.type === "monster") {
                        mesh.position.x = Constants.P2_BF_MONSTER5.x;
                        mesh.position.z = Constants.P2_BF_MONSTER5.y;
                    } else {
                        mesh.position.x = Constants.P2_BF_SPELL5.x;
                        mesh.position.z = Constants.P2_BF_SPELL5.y;
                    }
                    break;
            }
        }
        this.sceneObjects.push(mesh);
    }
}

export { BattleFieldView };