import { Card } from "./Card.js";
import { MonsterPosition } from "./CardFeature.js";

class Monster extends Card {

    constructor(id, name, image, description, attribute, level, race, subtype, atk, def) {
        super(id, name, image, description);
        this.attribute = attribute;
        this.level = level;
        this.race = race;
        this.subtype = subtype;
        this.atk = atk;
        this.def = def;
        this.position = MonsterPosition.NotSummoned;
    }

    summon() {
        this.position = MonsterPosition.Attack;
    }
}

export { Monster };