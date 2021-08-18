class Players {
    constructor () {
        this.playerOne = null;
        this.playerTwo = null;
        this.nameScreenModal = document.querySelector('.name-screen');
        this.overlayElement = document.querySelector('.overlay');
        this.playerOneButton = document.querySelector('.player-one-btn')
        this.playerTwoButton = document.querySelector('.player-two-btn')
        this.beginGameButton = document.querySelector('.begin-game-btn')
    }

    handleNameScreenModal () {
        this.nameScreenModal.classList.add('active');
        this.overlayElement.classList.add('active');
        this.beginGameButton.addEventListener('click', this.handlePlayerNames.bind(this))
       
    }

    handlePlayerNames () {
        const playerOneInputElement = document.querySelector('.player-one-name')
        const val1 = playerOneInputElement.value;
        this.playerOne = val1;

        const playerTwoInputElement = document.querySelector('.player-two-name')
        const val2 = playerTwoInputElement.value;
        this.playerTwo = val2;

        this.nameScreenModal.classList.remove('active')
        this.overlayElement.classList.remove('active')

    }

}

export default Players