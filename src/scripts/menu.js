function shuffle(arr) { return arr.sort(() => Math.random() - 0.5) }

class Menu {
    constructor () {
        this.menuElement = document.querySelector('.menu')
        this.appElement = document.querySelector('.app')
        this.twoPlayerAppElement = document.querySelector('.two-player-app')
        this.categoryListElement = document.querySelector('.categories')
        this.randomCategoryButton = document.querySelector('.random-category-button')
        this.clearCategoriesButton = document.querySelector('.clear-selected-categories')
        this.instructionsElement = document.querySelector('.instructions-container')
        this.closeInstructionsButton = document.querySelector('.close-instructions')
        this.infoElement = document.querySelector('.info-container')
        this.closeInfoButton = document.querySelector('.close-info')
        this.warningElement = document.querySelector('.warning-container')
        this.closeWarningButton = document.querySelector('.close-warning')
        this.overlayElement = document.querySelector('.overlay')
        // this.categoryIDs = [7, 442, 1892, 4483, 88, 67, 109, 114, 176, 42, 582, 49, 561, 770, 253, 83, 184, 211, 51, 672, 78, 574, 680, 50, 309, 249, 218, 17, 197, 2538, 1800]
        this.selectedCategoryIDs = []
        this.categories = {
            '3-Letter Animals': 4483,
            '4-Letter Words': 51,
            'American History': 780,
            'Animals': 21,
            'Before & After': 1800,
            'Bodies of Water': 211,
            'Books & Authors': 197,
            'Brand Names': 2537,
            'Business & Industry': 176,
            'Colleges & Universities': 672,
            'Fashion': 26,
            'Fruits & Vegetables': 777,
            'Food': 49,
            'Food & Drink': 253,
            'Geography': 88,
            'History': 114,
            'Homophones': 249,
            'Literature': 574,
            'The Movies': 309,
            'Musical Instruments': 184,
            'Mythology': 680,
            'Nature': 267,
            'People': 442,
            'Pop Music': 770,
            'Potent Potables': 83,
            'Rhyme Time': 561,
            'Science & Nature': 218,
            'Science': 25,
            'Sports': 42,
            'State Capitals': 109,
            'Television': 67,
            'Travel & Tourism': 369,
            'U.S. Cities': 7,
            'U.S. Geography': 582,
            'U.S. History': 50,
            'U.S. States': 17,
            'Video Games': 1892,  
            'Word Origins': 223,  
            'World Capitals': 78,
            'World History': 530
        }
    }

    playMenu () {
        this.appElement.classList.add('hide');
        this.twoPlayerAppElement.classList.add('hide');
        this.grabCategories();
        this.menuElement.addEventListener('click', event => {
            if (event.target.dataset.categoryId) {
                this.handleCategoryClick(event);
            }
        })

        this.randomCategoryButton.addEventListener('click', event => {
            const catIDs = Object.values(this.categories);
            const shuffledIDs = shuffle(catIDs);
            const fourIDs = shuffledIDs.slice(0,4);
            fourIDs.forEach(id => {
                const li = document.querySelector(`[data-category-id='${id}']`);
                this.selectedCategoryIDs.push(id);
                li.classList.add('selected-category');
            })
        })

        this.clearCategoriesButton.addEventListener('click', e => {
            for (let i = 0; i < this.selectedCategoryIDs.length; i++) {
                const categoryID = this.selectedCategoryIDs[i];
                const li = document.querySelector(`[data-category-id='${categoryID}']`);
                li.classList.remove('selected-category');
            }
            this.selectedCategoryIDs = [];
        })
    }

    grabCategories () {
        const catNames = Object.keys(this.categories);
        catNames.forEach(name => {
            var li = document.createElement('li');
            li.innerHTML = `<button class='cat-btn' data-category-id=${this.categories[name]} data-category-name='${name}'>${name}</button>`
            this.categoryListElement.appendChild(li);
        })
    }

    handleCategoryClick (e) {
        let selectedCategoryID = this.categories[e.target.dataset.categoryName]
        e.target.classList.add('selected-category');
        if (!this.selectedCategoryIDs.includes(selectedCategoryID)) {
            this.selectedCategoryIDs.push(selectedCategoryID);
        } else if (this.selectedCategoryIDs.includes(selectedCategoryID)) {
            this.selectedCategoryIDs = this.selectedCategoryIDs.filter(id => (id !== selectedCategoryID));
            const li = document.querySelector(`[data-category-id='${selectedCategoryID}']`);
            li.classList.remove('selected-category');
        }
    }

    handleInstructionsClick() {
        // this.instructionsElement.classList.remove('hide');
        this.instructionsElement.classList.add('active');
        this.overlayElement.classList.add('active');

        // const p = document.querySelector('.instructions-content');
        // p.textContent = '  '
        // put text into html
        this.closeInstructionsButton.addEventListener('click', () => {
            // this.instructionsElement.classList.add('hide');
            this.instructionsElement.classList.remove('active')
            this.overlayElement.classList.remove('active')
        })
    }

    handleInfoClick() {
        this.infoElement.classList.add('active');
        this.overlayElement.classList.add('active');
        
        this.closeInfoButton.addEventListener('click', () => {
            this.infoElement.classList.remove('active');
            this.overlayElement.classList.remove('active')
        })
    }

    handleWarningClick() {
        this.warningElement.classList.add('active');
        this.overlayElement.classList.add('active');

        this.closeWarningButton.addEventListener('click', () => {
            this.warningElement.classList.remove('active');
            this.overlayElement.classList.remove('active')
        })
    }
}

export default Menu 