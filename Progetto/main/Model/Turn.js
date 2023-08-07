import { Phase } from "./Phase.js";

class Turn {

    constructor() {
        this._turnNumber = 1;
        this._phase = Phase.DrawPhase;
    }

    get turn() {
        return this._turnNumber;
    }

    get phase() {
        return this._phase;
    }

    nextPhase() {
        if (this._phase == Phase.EndPhase) {
            this._phase = Phase.DrawPhase;
            this._turnNumber++;
        }
        else {
            this._phase++;
        }
    }
    toString() {
        return this._turnNumber + " - " + this._phase;
    }
}
export { Turn };
