while(true) {
    let start = Date.now();
    processInput();
    update();
    render();

    sleep(start + FRAMERATE - Date.now());
}