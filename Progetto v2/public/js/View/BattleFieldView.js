import { BaseView } from "../BaseView.js";
import { Cards, Constants } from "../Utils/Constants.js";

class BattleFieldView extends BaseView {

    _subscribeAll() {
        this.subscribe(this.model.id, "placeCard", this.placeCard);
        this.subscribe(this.model.id, "placeCard", this.spawnMoster);
        this.subscribe(this.model.id, "removeCard", this.removeCard);
    }

    _initializeScene() {
        this.plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: 5, height: 6 }, this.sharedComponents.scene);
        const material = new BABYLON.StandardMaterial("planeMaterial", this.sharedComponents.scene);
        material.diffuseTexture = new BABYLON.Texture("./img/battlefield-prova.png", this.sharedComponents.scene);
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
                    if (c !== null) {
                        this.placeCard({ player, position: i, id: c.id });
                        this.spawnMoster({ player, position: i, id: c.id });
                    }
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

        if (card.type === "monster") {
            if ((data.player === 1 && this.sharedComponents.camera.position.z > 0) || (data.player === 2 && this.sharedComponents.camera.position.z < 0)) {
                const behavior = new BABYLON.SixDofDragBehavior();
                behavior.disableMovement = true;
                behavior.onDragStartObservable.add( _ => this.publish(this.model.id, "attack", {from: data}));
                behavior.attach(mesh);
            } else {
                const behavior = new BABYLON.SixDofDragBehavior();
                behavior.disableMovement = true;
                behavior.onDragStartObservable.add( _ => this.publish(this.model.id, "attack", {to: data}));
                behavior.attach(mesh);
            }
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
        mesh.id = data.player + "" + data.position + card.type;
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
                mesh.loadedMeshes.dispose = function () {
                    mesh.loadedMeshes.forEach(m => m.dispose());
                }
                task.loadedMeshes.id = data.player + "" + data.position + card.id;
            };
            assetsManager.loadAsync().then(() => {
                this.sceneObjects.push(mesh.loadedMeshes);
            });
        }
    }

    removeCard(data) {
        const card = Cards.find(c => c.id === data.id);
        const cardMesh = this.sceneObjects.find(m => m.id === (data.player + "" + data.position + card.type));
        if (!cardMesh) throw Error("Card not found");
        this.sceneObjects.splice(this.sceneObjects.indexOf(cardMesh), 1);
        cardMesh.dispose();
        const monsterMesh = this.sceneObjects.find(m => m.id === (data.player + "" + data.position + card.id));
        if (!monsterMesh) throw Error("Monster not found");
        this.sceneObjects.splice(this.sceneObjects.indexOf(monsterMesh), 1);
        monsterMesh.dispose();
    }
}

export { BattleFieldView };