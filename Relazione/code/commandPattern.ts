interface Command {
    execute(): void;
}

class Jump implements Command {
    
    /*stuff*/
    
    execute() {
        character.jump();
    }
}

class InputHandler {
    buttonX: Command;

    constructor() {
        //some logics that decide which key bind to which command
        this.buttonX = new Jump();
    }

    handleInput(): void {
        if (isPressed(Key.X)) {
            this.buttonX.execute();
        }
    }
}