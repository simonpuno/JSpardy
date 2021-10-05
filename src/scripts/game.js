function shuffle(arr) { return arr.sort(() => Math.random() - 0.5) }

class Game {

    constructor (el, options) {

        // Get categories IMPLEMENT CAT SELECTION
        this.categoryIDs = options || [50, 253, 176, 672];
        
        // 'Database' of cats and clues
        this.categories = [];
        this.clues = {};

        // State
        this.currentClue = null;
        this.currentClueValue = null;
        this.score = 0;
        this.clueCount = null;
        this.skip = false;

        // HTML elements needed 
        this.menuElement = document.querySelector('.menu')
        this.boardElement = el.querySelector('.board')
        this.scoreElement = el.querySelector('.score')
        this.scoreCountElement = el.querySelector('.score-count')
        this.formElement = el.querySelector('form')
        this.inputElement = el.querySelector('input[name=user-answer]')
        this.cardModalElement = el.querySelector('.card-modal')
        this.cardModalInnerElement = el.querySelector('.card-modal-inner')
        this.clueCategoryElement = el.querySelector('.clue-category')
        this.clueTextElement = el.querySelector('.clue-text')
        this.resultElement = el.querySelector('.result')
        this.resultTextElement = el.querySelector('.result_correct-answer-text')
        this.successTextElement = el.querySelector('.result_success')
        this.failTextElement = el.querySelector('.result_fail')
        this.skipTextElement = el.querySelector('.skip-text')
        this.disputeButtonElement = el.querySelector('.dispute-btn')
        this.logo = el.querySelector('.game-title')
    }

    playGame () {
        this.updateScore(0);
        this.getCategories();
        this.boardElement.addEventListener('click', event => {
            if (event.target.dataset.clueId) {
                this.handleClueClick(event);
            }
        })

        this.formElement.addEventListener('submit', event => {
            this.handleFormSubmit(event);
        } )

        this.disputeButtonElement.addEventListener('click', event => {
            this.handleDisputeAnswer(event);
        })

        this.logo.addEventListener('click', event => {
            location.reload();
        })
    }

    updateScore (delta) {
        this.score += delta
        this.scoreCountElement.textContent = this.score;
    }

    getCategories () {
        const categories = this.categoryIDs.map (categoryID => {
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

                shuffle(category.clues).slice(0,5).forEach((clue, idx) => {
                    let clueID = categoryIdx + '-' + idx;
                    newCat.clues.push(clueID);
                    clue.answer = clue.answer.replace("<i>", "");
                    clue.answer = clue.answer.replace("</i>", "");

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

    renderCategory (category) {
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
        this.inputElement.focus();
    }

    handleFormSubmit (e) {
        e.preventDefault();
        // var isCorrect = this.fixAnswer(this.inputElement.value) === this.fixAnswer(this.currentClue.answer);
        var isCorrect = this.fixAnswer(this.inputElement.value, this.currentClue.answer)
        // check if correct
        if (isCorrect && this.skip === false) {
            this.updateScore(this.currentClue.value)
        } else if (isCorrect && this.skip === true) {

        } else {
            this.currentClue.value = this.currentClue.value * -1;
            this.updateScore(this.currentClue.value);
        }

        // reveal answer
        this.revealAnswer(isCorrect);
        // this.clueCount -= 1;
        if (this.clueCount === 0) {
            // debugger;
            setTimeout(() => {
                // alert('BANG!')
                this.showEndScreen();
            }, 3750);
        };
    
    }

    fixAnswer(input, answer) {
        if (input === "") {
            this.skip = true;
            return true;
        };
        const lowInput = input.toLowerCase();
        const lowAnswer = answer.toLowerCase();
        const regexInput = '\\b' + lowInput + '\\b'
        const regex = new RegExp(regexInput);
        return regex.test(lowAnswer);
    }

    // fixAnswer (str) {
    //     var answer = str.toLowerCase();
        // answer = answer.replace("<i>", "");
        // answer = answer.replace("</i>", "");
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

    revealAnswer (isCorrect) {
        this.skipTextElement.classList.add('hide')

        if (isCorrect && this.skip === false) {
            this.successTextElement.style.display = "block"
        } else if (isCorrect && this.skip === true) {
            this.successTextElement.style.display = "none"
            this.skip = false;
        } else if (!isCorrect) {
            this.successTextElement.style.display = "none"
        }
        this.failTextElement.style.display = !isCorrect ? "block" : "none";

        this.cardModalElement.classList.add('showing-result');

        

        setTimeout(() => {
            this.skipTextElement.classList.remove('hide')
            this.cardModalElement.classList.remove('visible');
        }, 2500);

        this.clueCount -= 1;
        
    }

    handleDisputeAnswer (e) {
        const delta = this.currentClueValue * 2;
        this.updateScore(delta);
        this.currentClueValue = 0;
    }

    showEndScreen() {
        const finalScoreModal = document.querySelector('.final-score-modal');
        const overlay = document.querySelector('.overlay');
        const restartGameButton = document.querySelector('.restart-game-btn')
        const finalScoreText = document.querySelector('.final-score-text')
        const menuElement = document.querySelector('.menu')
        const appElement = document.querySelector('.app')

        finalScoreText.textContent = `Your final score is: ${this.score}`
        finalScoreModal.classList.add('active');
        overlay.classList.add('active');

        restartGameButton.addEventListener('click', () => {
            location.reload();
        })
    }

}

export default Game