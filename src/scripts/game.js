function shuffle(arr) { return arr.sort(() => Math.random() - 0.5) }

class Game {

    constructor (el, options={}) {

        // Get categories IMPLEMENT CAT SELECTION
        this.categoryIDs = options.categoryIDs || [1892, 4483, 88, 218];
        
        // 'Database' of cats and clues
        this.categories = [];
        this.clues = {};

        // State
        this.currentClue = null;
        this.score = 0;

        // HTML elements needed 
        this.boardElement = el.querySelector('.board')
        this.scoreElement = el.querySelector('.score')
        this.scoreCountElement = el.querySelector('.score-count')
        this.formElement = el.querySelector('form')
        this.inputElement = el.querySelector('input[name=user-answer]')
        this.cardModalElement = el.querySelector('.card-modal')
        this.cardModalInnerElement = el.querySelector('.card-modal-inner')
        this.clueTextElement = el.querySelector('.clue-text')
        this.resultElement = el.querySelector('.result')
        this.resultTextElement = el.querySelector('.result_correct-answer-text')
        this.successTextElement = el.querySelector('.result_success')
        this.failTextElement = el.querySelector('.result_fail')
    }

    playGame () {
        this.updateScore(0);
        this.getCategories();

        this.boardElement.addEventListener('click', event => {
            if (event.target.dataset.clueID) {
                this.handleClueCick(event);
            }
        })

        this.formElement.addEventListener('submit', event => {
            this.handleFormSubmit(event);
        } )
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

                    this.clues[clueID] = {
                        question: clue.question,
                        answer: clue.answer,
                        value: (idx + 1) * 100
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

        this.boardElement.appendChild(col);
    }

    handleClueCick(e) {
        let clue = this.clues[e.target.dataset.clueID];
        e.target.classList.add('used');

        // clear card and change current clue to the select clue (from the event)
        this.inputElement.value = "";
        this.currentClue = clue;

        // add text content to clue modal 
        this.clueTextElement.textContent = this.currentClue.question;
        this.resultTextElement.textContent = this.currentClue.answer;

        this.cardModalElement.classList.remove('showing-result');
        this.cardModalElement.classList.add('visible');
        this.inputElement.focus();
    }

    handleFormSubmit (e) {
        e.preventDefault();
        var isCorrect = this.cleanseAnswer(this.inputElement.value) === this.cleanseAnswer(this.currentClue.answer);

        // check if correct
        if (isCorrect) {
            this.updateScore(this.currentClue.value)
        }

        // reveal answer
        this.revealAnswer(isCorrect);
    }

    cleanseAnswer (str) {
        var answer = input.toLowerCase();
        answer = answer.replace("<i>", "");
        answer = answer.replace("</i>", "");
        answer = answer.replace(/ /g, "");
        answer = answer.replace(/^a /, "");
        answer = answer.replace(/^an /, "");
        return answer.trim();
    }

    revealAnswer (isCorrect) {
        this.successTextElement.style.display = isCorrect ? "block" : "none";
        this.failTextElement.style.display = isCorrect ? "block" : "none";

        this.cardModalElement.classList.add('showing-result');

        setTimeout(() => {
            this.cardModalElement.classList.remove('visible');
        }, 3000);
    }
}

// const game = new Game (document.querySelector('.app'), {});
// game.playGame();

export default Game