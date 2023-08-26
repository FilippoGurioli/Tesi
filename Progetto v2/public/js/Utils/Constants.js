const Constants = {
    P1_POS: new BABYLON.Vector3(0, 2, 3),
    P2_POS: new BABYLON.Vector3(0, 2, -3),
    SPEC_POS: new BABYLON.Vector3(3, 2, 0),
    DISC_TIME_LIMIT: 10,
};

let Cards;

fetch('./js/Utils/Cards.json')
    .then((response) => response.json())
    .then((json) => {
        Cards = json; 
        Cards = Object.freeze(Cards);
    });

export { Constants, Cards };