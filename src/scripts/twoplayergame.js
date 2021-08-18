function shuffle(arr) { return arr.sort(() => Math.random() - 0.5) }

class twoPlayerGame {

    constructor(el, options, playerOne, playerTwo) {

        // Get categories IMPLEMENT CAT SELECTION
        this.categoryIDs = options || [50, 253, 176, 672];

        // 'Database' of cats and clues
        this.categories = [];
        this.clues = {};

        // State
        this.currentClue = null;
        this.currentClueValue = null;
        this.clueCount = null;
        this.currentPlayer = null;
        this.playerOne = {
            name: playerOne || 'playerOne',
            score: 0
        };
        this.playerTwo = {
            name: playerTwo || 'playerTwo',
            score: 0
        };

        // HTML elements needed 
        this.menuElement = document.querySelector('.menu')
        this.boardElement = el.querySelector('.board')
        this.appElement = document.querySelector('.two-player-app')

        this.playerOneScoreElement = el.querySelector('.player-one-score')
        this.playerTwoScoreElement = el.querySelector('.player-two-score')
        this.playerOneScoreCountElement = el.querySelector('.player-one-score-count')
        this.playerTwoScoreCountElement = el.querySelector('.player-two-score-count')

        this.inputContainerElement = el.querySelector('.input-container')
        this.playerInputTurnElement = el.querySelector('.player-input-turn')
        this.formElement = el.querySelector('.two-player-input-form')
        this.inputElement = el.querySelector('input[name=user-answer]')
        this.cardModalElement = el.querySelector('.card-modal')
        this.cardModalInnerElement = el.querySelector('.card-modal-inner')
        this.clueCategoryElement = el.querySelector('.clue-category')
        this.clueTextElement = el.querySelector('.clue-text')
        this.resultElement = el.querySelector('.result')
        this.resultTextElement = el.querySelector('.result_correct-answer-text')
        this.successTextElement = el.querySelector('.result_success')
        this.failTextElement = el.querySelector('.result_fail')
        this.disputeButtonElement = el.querySelector('.dispute-btn')

        this.handlePlayerKey = this.handlePlayerKey.bind(this)
    }

    playGame() {

        
        // this.menuElement.classList.add('hide')
        // this.appElement.classList.remove('hide')
        this.updateScore(this.playerOne, 0);
        this.updateScore(this.playerTwo, 0);
        this.getCategories();
        this.boardElement.addEventListener('click', event => {
            if (event.target.dataset.clueId) {
                this.handleClueClick(event);
            }
        })

        // this.formElement.addEventListener('submit', event => {
        //     this.handleFormSubmit(event);
        // })

        // document.addEventListener('keyup', event => {
        //     if (event.code === 'KeyP') {
        //         console.log(event);
        //         this.currentPlayer = this.playerOneScore
        //     } else if (event.code === 'KeyQ') {
        //         console.log(event);
        //         this.currentPlayer = this.playerTwoScore
        //     }

        // })

        this.disputeButtonElement.addEventListener('click', event => {
            this.handleDisputeAnswer(event);
        })
    }

    updateScore(currentPlayer, delta) {
        // currentPlayer.score += delta
        if (currentPlayer === this.playerOne) {
            // debugger;
            this.playerOne.score += delta 
            this.playerOneScoreCountElement.textContent = this.playerOne.score;
            // debugger;
        }
        
        if (currentPlayer === this.playerTwo) {
            this.playerTwo.score += delta
            this.playerTwoScoreCountElement.textContent = this.playerTwo.score;
            // debugger;
        }
        // this.scoreCountElement.textContent = playerScore;
    }

    getCategories() {
        const categories = this.categoryIDs.map(categoryID => {
            return new Promise((resolve, reject) => {
                fetch(`https://jservice.io/api/category?id=${categoryID}`)
                    .then(res => res.json())
                    .then(data => {
                        resolve(data);
                    })
            })
        });

        Promise.all(categories).then(results => {
            results.forEach((category, categoryIdx) => {
                var newCat = {
                    title: category.title,
                    clues: []
                }

                shuffle(category.clues).slice(0, 5).forEach((clue, idx) => {
                    let clueID = categoryIdx + '-' + idx;
                    newCat.clues.push(clueID);

                    this.clues[clueID] = {
                        question: clue.question,
                        answer: clue.answer,
                        value: (idx + 1) * 100,
                        category: category.title
                    }
                })

                this.categories.push(newCat);
            })
            this.categories.forEach(category => {
                this.renderCategory(category);
            })
        })
    }

    renderCategory(category) {
        let col = document.createElement('div');
        col.classList.add('column');
        col.innerHTML = (
            `<header>${category.title}</header><ul></ul>`
        )

        var ul = col.querySelector('ul');
        category.clues.forEach(clueID => {
            var clue = this.clues[clueID];
            ul.innerHTML += `<li><button data-clue-id=${clueID}>${clue.value}</button></li>`
        })
        this.clueCount = Object.keys(this.clues).length;
        this.boardElement.appendChild(col);
    }

    handleClueClick(e) {
        let clue = this.clues[e.target.dataset.clueId];
        e.target.classList.add('used');
        this.inputContainerElement.classList.add('hide')
        this.clueCount -= 1;

        // clear card and change current clue to the select clue (from the event)
        this.inputElement.value = "";
        this.currentClue = clue;
        this.currentClueValue = clue.value;
        // add text content to clue modal 
        this.clueCategoryElement.textContent = this.currentClue.category;
        this.clueTextElement.textContent = this.currentClue.question;
        this.resultTextElement.textContent = this.currentClue.answer;

        this.cardModalElement.classList.remove('showing-result');
        this.cardModalElement.classList.add('visible');
        // this.formElement.classList.add('hide');
        this.inputElement.focus();

        document.addEventListener('keyup', this.handlePlayerKey)
        // document.removeEventListener('keyup', this.handlePlayerKey)
            // if (event.code === 'KeyQ') {
            //     this.inputElement.value = "";
            //     document.removeEventListener('keyup')
            //     console.log(event);
            //     this.currentPlayer = this.playerOne
            //     this.formElement.addEventListener('submit', event => {
            //         this.handleFormSubmit(event);
            //     })
            // } else if (event.code === 'KeyP') {
            //     this.inputElement.value = "";
            //     console.log(event);
            //     this.currentPlayer = this.playerTwo
            //     this.formElement.addEventListener('submit', event => {
            //         this.handleFormSubmit(event);
            //     })
            // }
        this.formElement.addEventListener('submit', event => {
            this.handleFormSubmit(event);
        })

    }

    handlePlayerKey(event) {
        if (event.code === 'KeyQ') {
            this.inputElement.value = "";
            document.removeEventListener('keyup', this.handlePlayerKey)
            console.log(event);
            this.currentPlayer = this.playerOne
            this.inputContainerElement.classList.remove('hide');
            this.playerInputTurnElement.textContent = `${this.currentPlayer.name}'s answer:`;
            // this.formElement.addEventListener('submit', event => {
            //     this.handleFormSubmit(event);
            // })
            // debugger;
        } else if (event.code === 'KeyP') {
            this.inputElement.value = "";
            document.removeEventListener('keyup', this.handlePlayerKey)
            console.log(event);
            this.currentPlayer = this.playerTwo
            this.inputContainerElement.classList.remove('hide');
            this.playerInputTurnElement.textContent = `${this.currentPlayer.name}'s answer:`;
            // this.formElement.addEventListener('submit', event => {
            //     this.handleFormSubmit(event);
            // })
            // debugger;
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        // var isCorrect = this.fixAnswer(this.inputElement.value) === this.fixAnswer(this.currentClue.answer);
        var isCorrect = this.fixAnswer(this.inputElement.value, this.currentClue.answer)
        // debugger;
        // check if correct
        if (isCorrect) {
            this.updateScore(this.currentPlayer, this.currentClue.value);
            this.currentPlayer = null;
        } else {
            this.currentClue.value = this.currentClue.value * -1;
            this.updateScore(this.currentPlayer, this.currentClue.value);
            this.currentPlayer = null;
        }

        // reveal answer
        this.revealAnswer(isCorrect);

        if (this.clueCount === 0) {
            // debugger;
            setTimeout(() => {
                // alert('BANG!')
                this.showEndScreen();
            }, 3750);
        };
    }

    fixAnswer(input, answer) {
        const lowInput = input.toLowerCase();
        const lowAnswer = answer.toLowerCase();
        const regexInput = '\\b' + lowInput + '\\b'
        const regex = new RegExp(regexInput);
        return regex.test(lowAnswer);
    }

    // fixAnswer (str) {
    //     var answer = str.toLowerCase();
    //     answer = answer.replace("<i>", "");
    //     answer = answer.replace("</i>", "");
    //     answer = answer.replace(/ /g, "");
    //     answer = answer.replace("a", "");
    //     // answer = answer.replace(/a/, "");
    //     // answer = answer.replace(/an/, "");
    //     answer = answer.replace("an", "");
    //     answer = answer.replace("the", "");
    //     answer = answer.replace(/the/, "");
    //     answer = answer.replace("st", "");
    //     answer = answer.replace("saint", "");
    //     return answer.trim();
    // }

    revealAnswer(isCorrect) {
        this.successTextElement.style.display = isCorrect ? "block" : "none";
        this.failTextElement.style.display = !isCorrect ? "block" : "none";

        this.cardModalElement.classList.add('showing-result');

        setTimeout(() => {
            this.cardModalElement.classList.remove('visible');
        }, 2500);

        // this.clueCount -= 1;
    }

    handleDisputeAnswer(e) {
        const delta = this.currentClueValue * 2;
        this.updateScore(this.currentPlayer, delta);
        this.currentClueValue = 0;
    }

    showEndScreen() {
        const finalScoreModal = document.querySelector('.two-player-final-score-modal');
        const overlay = document.querySelector('.overlay');
        const restartGameButton = document.querySelector('.two-player-restart-game-btn')
        const playerOneScoreText = document.querySelector('.player-one-score-text')
        const playerTwoScoreText = document.querySelector('.player-two-score-text')
        const winnerText = document.querySelector('.winner')
        const menuElement = document.querySelector('.menu')
        const appElement = document.querySelector('.two-player-app')

        if (this.playerOne.score > this.playerTwo.score) {
            winnerText.textContent = 'playerOne Wins!'
        } else {
            winnerText.textContent = 'playerTwo Wins!'
        }

        playerOneScoreText.textContent = `playerOne's final score is: ${this.playerOne.score}.`
        playerTwoScoreText.textContent = `playerTwo's final score is: ${this.playerTwo.score}.`
        finalScoreModal.classList.add('active');
        overlay.classList.add('active');

        restartGameButton.addEventListener('click', () => {
            finalScoreModal.classList.remove('active');
            overlay.classList.remove('active');
            appElement.classList.add('hide');
            menuElement.classList.remove('hide');
        })
    }
}

// const game = new Game (document.querySelector('.app'), {});
// game.playGame();

export default twoPlayerGame