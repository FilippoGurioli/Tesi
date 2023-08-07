const Phase = {
    DrawPhase: 0,
    StandbyPhase: 1,
    MainPhase1: 2,
    BattlePhase: 3,
    MainPhase2: 4,
    EndPhase: 5
};

// Phase.toString = function() {
//     switch(phase) {
//         case Phase.DrawPhase:
//             return "Draw Phase";
//         case Phase.StandbyPhase:
//             return "Standby Phase";
//         case Phase.MainPhase1:
//             return "Main Phase 1";
//         case Phase.BattlePhase:
//             return "Battle Phase";
//         case Phase.MainPhase2:
//             return "Main Phase 2";
//         case Phase.EndPhase:
//             return "End Phase";
//     }
// }

export { Phase };