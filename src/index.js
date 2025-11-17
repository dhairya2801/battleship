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

board1.addEventListener('dragover', handleDragOver);
function handleDragOver(e) {
    e.preventDefault();
}

board1.addEventListener('drop', handleDrop);
function handleDrop(e) {
    e.preventDefault();
    // getBoundingClientRect gives the position of board1 relative to the viewport
    const x = e.clientX - board1.getBoundingClientRect().left;
    const y = e.clientY - board1.getBoundingClientRect().top;
    
    // to convert mouse's window coordinates (clientX, Y) into the board1's grid
    // coordinates.
    const col = Math.floor(x/40);
    const row = Math.floor(y/40);
    const snapLeft = col * 40;
    const snapTop = row * 40;
        
    const id = e.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const isRotated = draggableElement.classList.contains('rotated');

    let length = getShipLength(id);

    if (isOverflowing(col, row, length, isRotated)) {
        return; // Stops the drop
    }
    
    if (isOverlapping(col, row, length, isRotated, playerShipCoords)) {
        return; // Stops the drop
    }
    
    board1.appendChild(draggableElement);
    draggableElement.style.position = 'absolute';
    draggableElement.style.left = `${snapLeft}px`;
    draggableElement.style.top = `${snapTop}px`;

    // add placed class
    draggableElement.classList.add('placed');
    // store coordinates
    setShip(snapLeft/40, snapTop/40, draggableElement);
}

board1.addEventListener('click', handleShipRotate);
function handleShipRotate(e) {
    if (e.target.classList.contains('placed')) {
        const shipEle = e.target;
        shipEle.classList.toggle('rotated');
        setShip(parseInt(shipEle.style.left.slice(0, -2), 10)/40, 
            parseInt(shipEle.style.top.slice(0, -2), 10)/40, shipEle);
    }
}

const shipCoords1 = new Map();
const shipCoords2 = new Map();
const computerShipCoords = new Set();
const playerShipCoords = new Set();
const computerGuesses = new Set();

function isOverflowing(col, row, length, isRotated) {
    if (isRotated) {
        return row + length > 10;
    }
    else {
        return col + length > 10;
    }
}

function isOverlapping(col, row, length, isRotated, coordsSet) {
    for (let i=0; i<length; i++) {
        let coord;
        if (isRotated) {
            coord = `${row+i},${col}`;
        }
        else {
            coord = `${row},${col+i}`;
        }
        if (coordsSet.has(coord)) {
            return true;
        }
    }
    return false;
}


function setShip(left, top, ele) {
    const id = ele.id;
    const isRotated = ele.classList.contains('rotated');
    let length = getShipLength(id);
    shipCoords1.set(id, []);
    
    for (let i=0; i<length; i++) {
        if (isRotated) {
            shipCoords1.get(id).push([top+i, left]);
            playerShipCoords.add(`${top+i},${left}`);
        }
        else {
            shipCoords1.get(id).push([top, left+i]);
            playerShipCoords.add(`${top},${left+i}`);
        }
    }
}

function getShipLength(id) {
    if (id === "sa") {length = 4;}
    else if (id === "sb" || id === "sc") {length = 3;}
    else if (id === "sd" || id === "se" || id === "sf") {length = 2;}
    else {length = 1;}

    return length;
}

function updateStatus(message) {
    document.querySelector('.info').textContent = message;
}
const playBtn = document.getElementById('play');

playBtn.addEventListener('click', () => {
    frame2.classList.toggle('hidden');
    shipDock.classList.toggle('hidden');
    if (shipCoords1.size === 10) {
        startGame();
    }
    randomizeComputer();
})

const playerShips = new Set();
function startGame() {
    // contains cell coordinates with a ship
    for (const [key, value] of shipCoords1) {
        for (let i=0; i<value.length; i++) {
            playerShips.add(value);
        }
    }

}

function randomizeComputer() {
    const computerShips = [4,3,3,2,2,2,1,1,1,1];
    for (const length of computerShips) {
        let placed = false;
        while (!placed) {
            let col = Math.floor(Math.random() * 10);
            let row = Math.floor(Math.random() * 10);
            let isRotated = Math.random() > 0.5;

            // const overflow = isOverflowing(col, row, length, isRotated);
            const overflow = false;
            // const overlap = isOverlapping(col, row, length, isRotated, computerShipCoords);
            const overlap = false;

            if (!overflow && !overlap) {
                const shipId = `c-ship-${length}-${col},${row}`;
                shipCoords2.set(shipId, []);

                for (let i=0; i<length; i++) {
                    if (isRotated) {
                        shipCoords2.get(shipId).push([row+i, col]);
                        computerShipCoords.add(`${row+i},${col}`);
                    }
                    else {
                        shipCoords2.get(shipId).push([row, col+i]);
                        computerShipCoords.add(`${row},${col+i}`);
                    }
                }
                placed = true;
            }
        }
    }
    console.log(shipCoords2);
}

function humanTurn() {

}

function computerTurn() {

}