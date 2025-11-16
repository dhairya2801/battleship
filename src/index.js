// TODO:
// 1. when a ship is placed; 
// - disable the surrounding cells
// 2. handle ship edge cases
// - overflowing outside the board
// - overlapping on other ships
// - being placed on adjacent cells
// 3. add reset and randomize buttons
// 4. make a test run

const boards = document.getElementById('boards');
const board1 = document.getElementById('board1');
const board2 = document.getElementById('board2');
const frame2 = document.getElementById('frame2');
const shipDock = document.getElementById('ship-dock');

createBoard(board1);
createBoard(board2);
randomizeComputer();

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

    // add placed class
    draggableElement.classList.add('placed');
    // store coordinates
    setShip(snapLeft/40, snapTop/40, draggableElement);
})

board1.addEventListener('click', (e) => {
    if (e.target.classList.contains('placed')) {
        const shipEle = e.target;
        shipEle.classList.toggle('rotated');
        setShip(parseInt(shipEle.style.left.slice(0, -2), 10)/40, 
            parseInt(shipEle.style.top.slice(0, -2), 10)/40, shipEle);
    }
})

const shipCoords1 = new Map();
const shipCoords2 = new Map();

function setShip(left, top, ele) {
    const id = ele.id;
    const isRotated = ele.classList.contains('rotated');
    let length = 0;
    shipCoords1.set(id, []);
    
    if (id === "sa") {length = 4;}
    else if (id === "sb" || id === "sc") {length = 3;}
    else if (id === "sd" || id === "se" || id === "sf") {length = 2;}
    else {length = 1;}
    
    for (let i=0; i<length; i++) {
        if (isRotated) {
            shipCoords1.get(id).push([top+i, left]);
        }
        else {
            shipCoords1.get(id).push([top, left+i]);
        }
    }
}

const playBtn = document.getElementById('play');
const info = document.querySelector('.info');
playBtn.addEventListener('click', () => {
    frame2.classList.toggle('hidden');
    shipDock.classList.toggle('hidden');
    info.textContent = 'Your turn. Fire on the computer\'s board.';
    if (shipCoords1.size === 10) {
        startGame();
    }
})

function startGame() {
    
}

function randomizeComputer() {

}