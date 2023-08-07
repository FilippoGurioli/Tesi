// Croquet Tutorial 1
// Hello World 
// Croquet Corporation 
// 2021

import { RootView } from "./view.js";
import { RootModel } from "./model.js";

Croquet.Session.join({
    apiKey: '1HE1txmpJCe5Cp8Pzd3Dpmq4a9gu6PqKhar4tcHtq',
    appId: 'it.unibo.studio.filippo.gurioli.microverse',
    name: "unnamed",
    password: "secret",
    inactivityTimeout: 600, //timeout dopo 10 minuti di inattività
    model: RootModel,
    view: RootView
});