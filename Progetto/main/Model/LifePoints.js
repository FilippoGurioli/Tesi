class LifePoints {
    constructor() {
        this.lifePoints = 8000;
    }

    get LP() {
        return this.lifePoints;
    }

    heal(lifePoints) {
        this.lifePoints += lifePoints;
    }

    damage(lifePoints) {
        this.lifePoints -= lifePoints;
        if (this.lifePoints < 0) {
            this.lifePoints = 0;
        }
    }
}

export { LifePoints };