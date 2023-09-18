class GameModel extends BaseModel {
    _initialize() {
        this.playersInfo = {
            p1: { viewId: "", isConnected: false },
            p2: { viewId: "", isConnected: false }
        }
        /*creazione dei modelli di gioco*/
    }
    _subscribeAll() {
        this.subscribe(this.id, "join", this.join);
        this.subscribe(this.sessionId, "view-exit", this.left);
    }
    join(data) {
        let role = "Spectator";
        if (this.playersInfo.p1.viewId === "") {
            this.playersInfo.p1.viewId = data.view;
            this.playersInfo.p1.isConnected = true;
            role = "Player 1";
        } else if (this.playersInfo.p2.viewId === "") {
            this.playersInfo.p2.viewId = data.view;
            this.playersInfo.p2.isConnected = true;
            role = "Player 2";
        } else if (this.playersInfo.p1.viewId === data.view) {
            this.playersInfo.p1.isConnected = true;
            role = "Player 1";
            this.publish(this.playersInfo.p2.viewId, "opponent-recover");
        } else if (this.playersInfo.p2.viewId === data.view) {
            this.playersInfo.p2.isConnected = true;
            role = "Player 2";
            this.publish(this.playersInfo.p1.viewId, "opponent-recover");
        }
        this.publish(data.view, "join-response", {role: role});
    }
    left(viewId) {
        if (this.playersInfo.p1.viewId === viewId) {
            this.playersInfo.p1.isConnected = false;
            this.selfDestroy();
            this.publish(this.playersInfo.p2.viewId, "opponent-left");
        } else if (this.playersInfo.p2.viewId === viewId) {
            this.playersInfo.p2.isConnected = false;
            this.selfDestroy();
            this.publish(this.playersInfo.p1.viewId, "opponent-left");
        }
    }
    selfDestroy() {
        if (!this.playersInfo.p1.isConnected || !this.playersInfo.p2.isConnected) {
            this.counter++;
            if (this.counter >= Constants.DISC_TIME_LIMIT) {
                this.publish(this.sessionId, "game-over", {winner: this.playersInfo.p1.isConnected ? this.playersInfo.p1.viewId : this.playersInfo.p2.viewId});
            } else {
                this._log("Waiting for reconnection...");
                this.future(1000).selfDestroy();
            }
        } else {
            this.counter = 0;
        }
    }
}