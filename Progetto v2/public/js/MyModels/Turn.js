const Phase = {
    DrawPhase: "Draw Phase",
    StandbyPhase: "Standby Phase",
    MainPhase1: "Main Phase 1",
    BattlePhase: "Battle Phase",
    MainPhase2: "Main Phase 2",
    EndPhase: "End Phase"
};

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
        switch (this._phase) {
            case Phase.DrawPhase:
                this._phase = Phase.StandbyPhase;
                break;
            case Phase.StandbyPhase:
                this._phase = Phase.MainPhase1;
                break;
            case Phase.MainPhase1:
                this._phase = Phase.BattlePhase;
                break;
            case Phase.BattlePhase:
                this._phase = Phase.MainPhase2;
                break;
            case Phase.MainPhase2:
                this._phase = Phase.EndPhase;
                break;
            case Phase.EndPhase:
                this._phase = Phase.DrawPhase;
                this._turnNumber++;
                break;
        }
    }

    toString() {
        return this._turnNumber + " - " + this._phase;
    }
}

export { Turn, Phase };