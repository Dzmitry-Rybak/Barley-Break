window.addEventListener('DOMContentLoaded', () => {
    const rows = [
        document.getElementById('row1').children,
        document.getElementById('row2').children,
        document.getElementById('row3').children
    ]
    const board = [
        [1,2,3],
        [4,5,6],
        [7,8,0]
    ]
    console.log(rows)
    const myBoard = document.getElementById('board')

    // Let's put the content from board into the button elements.
    function drawAll () {
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
    drawAll()

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
            console.log(from)
            console.log(to)
            move(from, to)
            
        }
    })

    // Add button movement 
    
    function move(from, to) {
        const temp = board[from.y][from.x]
        board[from.y][from.x] = board[to.y][to.x]
        board[to.y][to.x] = temp
        drawAll()
    }

})