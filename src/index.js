import Game from "./scripts/game"

document.addEventListener("DOMContentLoaded", () => {
    // const test = document.querySelector('.test');
    // test.innerHTML = 'hello world';
    const game = new Game(document.querySelector('.app'), {});
    game.playGame();
})