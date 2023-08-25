class LifePoints {
    constructor() {
        this.lifePoints = 8000;
    }

    get LP() {
        return this.lifePoints;
    }

    heal(lifePoints) {
        if (lifePoints < 0) throw new Error("The amout must be positive");
        this.lifePoints += lifePoints;
    }

    damage(lifePoints) {
        if (lifePoints < 0) throw new Error("The amout must be positive");
        this.lifePoints -= lifePoints;
        if (this.lifePoints < 0) {
            this.lifePoints = 0;
        }
    }
}

export { LifePoints };