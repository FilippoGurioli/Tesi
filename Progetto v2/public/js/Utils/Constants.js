const Constants = {
    P1_POS: new BABYLON.Vector3(0, 2, 3),
    P2_POS: new BABYLON.Vector3(0, 2, -3),
    SPEC_POS: new BABYLON.Vector3(3, 2, 0),
    DISC_TIME_LIMIT: 10,
    P1_BF_MONSTER1: {x: 2, y: 1},
    P1_BF_MONSTER2: {x: 192, y: 638},
    P1_BF_MONSTER3: {x: 360, y: 638},
    P1_BF_MONSTER4: {x: 528, y: 638},
    P1_BF_MONSTER5: {x: 696, y: 638},
    P1_BF_SPELL1: {x: 2, y: 2},
    P1_BF_SPELL2: {x: 192, y: 821},
    P1_BF_SPELL3: {x: 360, y: 821},
    P1_BF_SPELL4: {x: 528, y: 821},
    P1_BF_SPELL5: {x: 696, y: 821},
    P2_BF_MONSTER1: {x: 24, y: 209},
    P2_BF_MONSTER2: {x: 192, y: 209},
    P2_BF_MONSTER3: {x: 360, y: 209},
    P2_BF_MONSTER4: {x: 528, y: 209},
    P2_BF_MONSTER5: {x: 696, y: 209},
    P2_BF_SPELL1: {x: 24, y: 23},
    P2_BF_SPELL2: {x: 192, y: 23},
    P2_BF_SPELL3: {x: 360, y: 23},
    P2_BF_SPELL4: {x: 528, y: 23},
    P2_BF_SPELL5: {x: 696, y: 23},
    BF_CARD_DIM: {w: 150, h: 168}
};

let Cards;

fetch('./js/Utils/Cards.json')
    .then((response) => response.json())
    .then((json) => {
        Cards = json; 
        Cards = Object.freeze(Cards);
});

export { Constants, Cards };