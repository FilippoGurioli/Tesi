import { BaseModel } from '../BaseModel.js';

class DeckModel extends BaseModel {

    deck = [];

    _initialize(data) {
        deck = data.deck;
        if (data.hasOwnProperty("seed")) {
            
        }
    }
}