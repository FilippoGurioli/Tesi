const Constants = {
    P1_POS: new BABYLON.Vector3(0, 1.8, 5),
    P2_POS: new BABYLON.Vector3(0, 1.8, -5),
    SPEC_POS: new BABYLON.Vector3(5, 1.8, 0),
    DISC_TIME_LIMIT: 10,
    P1: {
        MONSTER1: {x: 2, y: 1.5},
        MONSTER2: {x: 1, y: 1.5},
        MONSTER3: {x: 0, y: 1.5},
        MONSTER4: {x: -1, y: 1.5},
        MONSTER5: {x: -2, y: 1.5},
        SPELL1: {x: 2, y: 2.5},
        SPELL2: {x: 1, y: 2.5},
        SPELL3: {x: 0, y: 2.5},
        SPELL4: {x: -1, y: 2.5},
        SPELL5: {x: -2, y: 2.5},
    },
    P2: {
        MONSTER1: {x: 2, y: -1.5},
        MONSTER2: {x: 1, y: -1.5},
        MONSTER3: {x: 0, y: -1.5},
        MONSTER4: {x: -1, y: -1.5},
        MONSTER5: {x: -2, y: -1.5},
        SPELL1: {x: 2, y: -2.5},
        SPELL2: {x: 1, y: -2.5},
        SPELL3: {x: 0, y: -2.5},
        SPELL4: {x: -1, y: -2.5},
        SPELL5: {x: -2, y: -2.5}
    }
};

let Cards;

fetch('./js/Utils/Cards.json')
    .then((response) => response.json())
    .then((json) => {
        Cards = json; 
        Cards = Object.freeze(Cards);
});

export { Constants, Cards };