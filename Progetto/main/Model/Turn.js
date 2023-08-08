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
    
    get isPlayer1Turn() {
        return this._turnNumber % 2 === 1;
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
        let phase = "";
        switch (this._phase) {
            case Phase.DrawPhase:
                phase = "Draw Phase";
                break;
            case Phase.StandbyPhase:
                phase = "Standby Phase";
                break;
            case Phase.MainPhase1:
                phase = "Main Phase 1";
                break;
            case Phase.BattlePhase:
                phase = "Battle Phase";
                break;
            case Phase.MainPhase2:
                phase = "Main Phase 2";
                break;
            case Phase.EndPhase:
                phase = "End Phase";
                break;
        }
        return this._turnNumber + " - " + phase;
    }
}
export { Turn };
