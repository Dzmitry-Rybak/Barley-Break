    window.addEventListener('DOMContentLoaded', () => {

        const rows = [
            document.querySelectorAll('#row1 > button'),
            document.querySelectorAll('#row2 > button'),
            document.querySelectorAll('#row3 > button')
        ];

        const myBoard = document.getElementById('board'),
              step = document.getElementById('step'),
              time = document.getElementById('time'),
              win = document.getElementById('message'),
              startArray = [1, 2, 3, 4, 5, 6, 7, 8, 0],
              clearScore = document.querySelector('.clear__score');

        let board = shuffleArray(startArray);
        let numberOfsteps = 0;

        function disableButton (state) {
            rows.forEach((row) => {
                for(let btn of row) {
                    btn.disabled = state;
                }
            })
        }

        // Let's put the content from board into the button elements.
        function drawAll () {

            if(JSON.stringify(board.flat()) === JSON.stringify(startArray)) {
                clearInterval(timeIterval);
                addScoreItem(numberOfsteps, time.textContent)
                win.style.display = 'block';
                setTimeout(() => {
                    win.style.opacity = '1';
                }, 10);
                setTimeout(() => {
                    win.style.display = 'none';
                }, 5000)

                numberOfsteps = 0;

                disableButton(true);

                const liItems = Array.from(document.getElementsByClassName('score__item'));
                const liData = liItems.map((item) => item.outerHTML);
                localStorage.setItem('listScore', JSON.stringify(liData));

            }
            
            for(let y = 0 ; y < 3; y++){
                for(let x = 0; x < 3; x++) {
                    rows[y][x].textContent = board[y][x] ? board[y][x] : '';
                    rows[y][x].dataset.x = x;
                    rows[y][x].dataset.y = y;
                    if(board[y][x] === 0 ){
                        rows[y][x].classList.add('empty')
                    } else {
                        rows[y][x].classList.remove('empty')
                    }
                }
            }
        }
    
        function shuffleArray(array) {
            let shuffledArray = array.slice(); 

            for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }

            let resultArray = [];
            while (shuffledArray.length) {
            resultArray.push(shuffledArray.splice(0, 3));
            }
            
            return resultArray;
        }
        
        let timeIterval;
        
        // clicked New Game
        
        function handleNewGameClick() {
            clearInterval(timeIterval);
            board = shuffleArray(startArray)
            let secondsCount = 0,
                minutesCount = 0,
                formattedSeconds,
                formattedMinutes;

            disableButton(false);

            timeIterval = setInterval(() => {
                formattedSeconds = secondsCount < 10 ? `0${secondsCount}` : `${secondsCount}`;
                formattedMinutes = minutesCount < 10 ?  `0${minutesCount}` : `${minutesCount}`;
                time.textContent = `Time: ${formattedMinutes}:${formattedSeconds}`;
                secondsCount++;
                if(secondsCount > 59) {
                    minutesCount++;
                    secondsCount = 0;
                }
                if(formattedMinutes === '60' && formattedSeconds === '00') {
                    clearInterval(timeIterval);
                    alert('You loose')
                }
            }, 1000)
    
            stepCounter = 0;
            step.textContent = 'Steps: 0';
            drawAll()

        }

        // Get the coordinates of the empty element.
        function getEmptyCellCoordinates() {
            let x;
            let y;
            for( let row = 0; row < 3; row++){
                y = row;
                x = board[row].indexOf(0)
                if(x !== -1) {
                    break;
                }
            }
            return {y, x}
        }
        getEmptyCellCoordinates()

        // Add event listener 'click' with the coordinates of the block.
        
        myBoard.addEventListener('click', (event) => {
            if(event.target.tagName === 'BUTTON'){
                const from = {
                    y: event.target.dataset.y,
                    x: event.target.dataset.x
                };
                const to = getEmptyCellCoordinates();
                move(from, to)
            }
        })

        // Add button movement 
        
        let stepCounter = 0; // Counting user's steps

        function move(from, to) {
            if(moveValidation(from, to)) {
                const temp = board[from.y][from.x];
                board[from.y][from.x] = board[to.y][to.x];
                board[to.y][to.x] = temp;

                stepCounter++;
                step.textContent = `Steps: ${stepCounter}`;
                numberOfsteps = stepCounter;
                drawAll();
            }

        }

        // Cheking move validation

        function moveValidation (from, to) {
            
            if(from.y == to.y || from.x == to.x) {
                // if (Math.abs(from.y - to.y) === 1 || Math.abs(from.x - to.x) === 1)
                if((from.y - to.y == 1 || from.y - to.y == -1) || (from.x - to.x == 1 || from.x - to.x == -1)){
                    return true
                }   
            }
            return false
        }


        const scoreList = document.querySelector('.score__items');


        function addScoreItem (steps, time) {
            
            if(localStorage.getItem('listScore')) {
                const liData = JSON.parse(localStorage.getItem('listScore'));
                const restoredLiItems = liData.map(itemHTML => {
                    const tempLi = document.createElement('li');
                    tempLi.innerHTML = itemHTML;
                    return tempLi.firstChild;
                });
                scoreList.innerHTML = '';
                restoredLiItems.forEach((restoredLi) => {
                    scoreList.append(restoredLi);
                });
            }
            if (steps && time) {
                const li = document.createElement('li');
                li.classList.add('score__item');
                li.dataset.steps = steps;
                
                const scoreStep = document.createElement('span');
                scoreStep.classList.add('score-steps');
                scoreStep.textContent = `Steps: ${steps}`
                

                const scoreTime = document.createElement('span');
                scoreTime.classList.add('score-time');
                scoreTime.textContent = time;

                li.append(scoreStep);
                li.append(scoreTime);
                
                if (scoreList.children.length === 5) {
                    const lastItem = scoreList.children[scoreList.children.length - 1];
                    scoreList.replaceChild(li, lastItem);
                } else {
                    scoreList.appendChild(li);
                }

                const liItems = Array.from(scoreList.children);
                const liData = liItems.map((item) => item.outerHTML);
                localStorage.setItem('listScore', JSON.stringify(liData));
            }

        } 
        addScoreItem();

        // clear localStorage

        clearScore.addEventListener('click', () => {
            scoreList.innerHTML = ''
            localStorage.removeItem('listScore');
        });

        document.querySelector('.new-game').addEventListener('click', handleNewGameClick);
})