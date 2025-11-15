// TODO:
// 1. when a ship is placed; 
// - store the cell coordinates to indicate during hit
// - disable the surrounding cells
// - allow 90 deg rotate on click
// 2. handle ship overflowing outside the board
// 3. randomize the second board, fired on a button click
// 4. make a test run

const boards = document.getElementById('boards');
const board1 = document.getElementById('board1');
const board2 = document.getElementById('board2');
createBoard(board1);
createBoard(board2);

function createBoard(board) {
    for (let i=0; i<100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('board-cell');
        cell.dataset.row = Math.floor(i / 10);
        cell.dataset.col = i % 10;
        board.appendChild(cell);
    }
}

const ships = document.querySelectorAll('.ship');
ships.forEach(ship => {
    ship.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
    })
});

board1.addEventListener('dragover', (e) => {
    e.preventDefault();
})

board1.addEventListener('dragleave', (e) => {

})
board1.addEventListener('drop', (e) => {
    e.preventDefault();
    // getBoundingClientRect gives the position of board1 relative to the viewport
    const x = e.clientX - board1.getBoundingClientRect().left;
    const y = e.clientY - board1.getBoundingClientRect().top;
    
    // to convert mouse's window coordinates (clientX, Y) into the board1's grid
    // coordinates.
    const snapLeft = Math.floor(x/40) * 40;
    const snapTop = Math.floor(y/40) * 40;
        
    const id = e.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    board1.appendChild(draggableElement);

    draggableElement.style.position = 'absolute';
    draggableElement.style.left = `${snapLeft}px`;
    draggableElement.style.top = `${snapTop}px`;
})