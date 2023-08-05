class Turn {
    private _turnNumber: number;
    private _phase: Phase;
    private _player1: boolean;

    constructor() {
        this._turnNumber = 1;
        this._phase = Phase.DrawPhase;
        this._player1 = true;
    }

    get turn(): number {
        return this._turnNumber;
    }

    get phase(): Phase {
        return this._phase;
    }

    get isPlayer1Playing(): boolean {
        return this._player1;
    }

    nextPhase(): void {
        if (this._phase == Phase.EndPhase) {
            this._phase = Phase.DrawPhase;
            this._turnNumber++;
            this._player1 = !this._player1;
        } else {
            this._phase++;
        }
    }

    toString(): string {
        return this._turnNumber + " - " + this._phase;
    }

}