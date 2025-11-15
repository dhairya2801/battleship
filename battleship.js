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

boards.addEventListener('click', (e) => {
    if (e.target.classList.contains('board-cell')) {
        console.log(e.target.dataset.row, e.target.dataset.col);
    }
})