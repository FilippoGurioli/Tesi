const Constants = {
    P1_POS: new BABYLON.Vector3(0, 3, 8),
    P2_POS: new BABYLON.Vector3(0, 3, -8),
    SPEC_POS: new BABYLON.Vector3(8, 3, 0),
    DISC_TIME_LIMIT: 10,
};

let Cards;

fetch('./main/Utils/Cards.json')
    .then((response) => response.json())
    .then((json) => {
        Cards = json; 
        Cards = Object.freeze(Cards);
    });

export { Constants, Cards };