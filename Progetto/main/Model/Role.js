const Role = {
    PLAYER1: 0,
    PLAYER2: 1,
    SPECTATOR: 2
}

Role.toString = function(role) {
    switch(role) {
        case Role.PLAYER1:
            return "Player 1";
        case Role.PLAYER2:
            return "Player 2";
        case Role.SPECTATOR:
            return "Spectator";
    }
}

export { Role };