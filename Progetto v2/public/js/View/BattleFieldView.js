import { BaseView } from "../BaseView.js";
import { Cards, Constants } from "../Utils/Constants.js";

class BattleFieldView extends BaseView {

    _subscribeAll() {
        this.subscribe(this.model.id, "placeCard", this.placeCard);
        this.subscribe(this.model.id, "placeCard", this.spawnMoster);
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

        //if restoring an already start match, place all cards
        const cardTypes = ["Monsters", "Spells"];
        for (let player = 1; player <= 2; player++) {
            for (let type of cardTypes) {
                this.model.getCardCollection(type, player).forEach((c, i) => {
                    if (c !== null) this.placeCard({ player, position: i, id: c.id });
                });
            }
        }
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

        if (card.type === "monster" && ((data.player === 1 && this.sharedComponents.camera.position.z > 0) || (data.player === 2 && this.sharedComponents.camera.position.z < 0))) {
            const behavior = new BABYLON.SixDofDragBehavior();
            behavior.disableMovement = true;
            behavior.onDragStartObservable.add(_=>{
                this.publish(this.model.id, "attack", data);
            });
            behavior.attach(mesh);
        }

        const material = new BABYLON.StandardMaterial("cardMaterial", this.sharedComponents.scene);
        material.diffuseTexture = new BABYLON.Texture(card.imageOnBF, this.sharedComponents.scene);
        material.diffuseTexture.hasAlpha = true;
        mesh.material = material;
        mesh.rotation.x = Math.PI / 2;

        mesh.position.y = 0.04;
        if (data.player === 1) {
            mesh.rotation.y = Math.PI;
        }
        const playerConstants = data.player === 1 ? Constants.P1 : Constants.P2;
        const monsterConstantPrefix = card.type === "monster" ? "MONSTER" : "SPELL";

        const constantX = playerConstants[`${monsterConstantPrefix}${data.position + 1}`].x;
        const constantZ = playerConstants[`${monsterConstantPrefix}${data.position + 1}`].y;
        mesh.position.x = constantX;
        mesh.position.z = constantZ;

        this.sceneObjects.push(mesh);
    }

    spawnMoster(data) {
        const card = Cards.find(c => c.id === data.id);
        if (!card) throw Error("Card not found");
        var assetsManager = new BABYLON.AssetsManager(this.sharedComponents.scene);
        assetsManager.usingDefaultLoadingScreen = false;
        assetsManager.autoHideLoadingUI = true;
        if (card.type === "monster") {
            var mesh = assetsManager.addMeshTask("monster loading task", "", card.meshRoot, card.meshFile);
            mesh.onSuccess = function (task) {
                task.loadedMeshes[0].position.y = 0.06;
                task.loadedMeshes[0].scalingDeterminant = 0.075;
                if (data.player === 1) {
                    task.loadedMeshes[0].rotate(BABYLON.Vector3.Up(), -Math.PI);
                }
                const playerConstants = data.player === 1 ? Constants.P1 : Constants.P2;
                const monsterConstantPrefix = card.type === "monster" ? "MONSTER" : "SPELL";

                const constantX = playerConstants[`${monsterConstantPrefix}${data.position + 1}`].x;
                const constantZ = playerConstants[`${monsterConstantPrefix}${data.position + 1}`].y;
                task.loadedMeshes[0].position.x = constantX;
                task.loadedMeshes[0].position.z = constantZ;
            };
            assetsManager.loadAsync().then(() => mesh.loadedMeshes.forEach(m => this.sceneObjects.push(m)));
        }
    }
}

export { BattleFieldView };