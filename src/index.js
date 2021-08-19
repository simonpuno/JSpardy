import Menu from "./scripts/menu"
import Game from "./scripts/game"
import twoPlayerGame from "./scripts/twoplayergame"
import Players from "./scripts/players"
import {audio} from "./scripts/music"

document.addEventListener("DOMContentLoaded", () => {
    // const test = document.querySelector('.test');
    // test.innerHTML = 'hello world';
    const menu = new Menu();
    menu.playMenu();
    audio();
    const playGameButton = document.querySelector('.start-button')
    const playTwoPlayerGameButton = document.querySelector('.two-player-start-btn')
    const menuElement = document.querySelector('.menu')
    const appElement = document.querySelector('.app')
    const twoPlayerAppElement = document.querySelector('.two-player-app')
    const instructionsButton = document.querySelector('.fa-question-circle')
    const infoButton = document.querySelector('.fa-info-circle')
    const beginGameButton = document.querySelector('.begin-game-btn')

    instructionsButton.addEventListener('click', () => {
        menu.handleInstructionsClick();
    })

    infoButton.addEventListener('click', () => {
        menu.handleInfoClick();
    })
    
    playGameButton.addEventListener('click', e => {
        if (menu.selectedCategoryIDs.length > 0) {
            menuElement.classList.add('hide')
            appElement.classList.remove('hide')
            const game = new Game(document.querySelector('.app'), menu.selectedCategoryIDs);
            game.playGame();
        } else {
            menu.handleWarningClick();
        }
    })

    playTwoPlayerGameButton.addEventListener('click', e => {
        // menuElement.classList.add('hide')
        // twoPlayerAppElement.classList.remove('hide')
        if (menu.selectedCategoryIDs.length > 0) {
            const players = new Players(); 
            players.handleNameScreenModal();
            // const game = new twoPlayerGame(document.querySelector('.two-player-app'), menu.selectedCategoryIDs);
            // game.playGame();
            beginGameButton.addEventListener('click', () => {
                menuElement.classList.add('hide')
                twoPlayerAppElement.classList.remove('hide')
                const game = new twoPlayerGame(document.querySelector('.two-player-app'), menu.selectedCategoryIDs, players.playerOne, players.playerTwo);
                game.playGame();
            })
        } else {
            menu.handleWarningClick();
        }
    })

    // beginGameButton.addEventListener('click', () => {
    //     menuElement.classList.add('hide')
    //     twoPlayerAppElement.classList.remove('hide')
    //     const game = new twoPlayerGame(document.querySelector('.two-player-app'), menu.selectedCategoryIDs, players.playerOne, players.playerTwo);
    //     game.playGame();
    // })

    // playTwoPlayerGameButton.addEventListener('click', e => {
    //     menuElement.classList.add('hide')
    //     twoPlayerAppElement.classList.remove('hide')
    //     const game = new twoPlayerGame(document.querySelector('.two-player-app'), menu.selectedCategoryIDs);
    //     game.playGame();
    // })
})