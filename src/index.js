import './battleship.css';

class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.ships = new Map();       
        this.occupied = new Set();    
        this.missedShots = new Set(); 
        this.hitShots = new Set();
    }

    _key(r, c) { return `${r},${c}`; }

    reset() {
        this.ships.clear();
        this.occupied.clear();
        this.missedShots.clear();
        this.hitShots.clear();
    }

    placeShip(shipId, length, row, col, isRotated) {
        // 1. Validate
        if (!this.isValidPlacement(length, row, col, isRotated)) {
            return false; // Failed to place
        }

        // 2. Remove old position if ship already exists (for drag-and-drop moves)
        if (this.ships.has(shipId)) {
            this.removeShip(shipId);
        }

        // 3. Add new position
        const coords = [];
        for (let i = 0; i < length; i++) {
            const r = isRotated ? row + i : row;
            const c = isRotated ? col : col + i;
            const key = this._key(r, c);
            
            this.occupied.add(key);
            coords.push({ r, c });
        }
        this.ships.set(shipId, coords);
        return true; // Successfully placed
    }

    removeShip(shipId) {
        const coords = this.ships.get(shipId);
        coords.forEach(({ r, c }) => {
            this.occupied.delete(this._key(r, c));
        });
        this.ships.delete(shipId);
    }

    receiveAttack(row, col) {
        const key = this._key(row, col);
        // Check if we already shot here
        if (this.missedShots.has(key) || this.hitShots.has(key)) return null;

        if (this.occupied.has(key)) {
            this.hitShots.add(key);
            
            // Check if all ships are sunk
            const allSunk = this.hitShots.size === this.occupied.size;
            return { result: 'hit', allSunk };
        } else {
            this.missedShots.add(key);
            return { result: 'miss', allSunk: false };
        }
    }

    isValidPlacement(length, row, col, isRotated) {
        // 1. Check Overflow
        if (isRotated) {
            if (row + length > this.size) return false;
        } else {
            if (col + length > this.size) return false;
        }

        // 2. Check Overlap & Adjacency
        const proposedKeys = new Set();
        for (let i = 0; i < length; i++) {
            const r = isRotated ? row + i : row;
            const c = isRotated ? col : col + i;
            proposedKeys.add(this._key(r, c));
        }

        // Check neighbors of every proposed cell
        for (const key of proposedKeys) {
            const [r, c] = key.split(',').map(Number);

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const neighborKey = this._key(r + dr, c + dc);
                    if (this.occupied.has(neighborKey) && !proposedKeys.has(neighborKey)) {
                        return false; 
                    }
                }
            }
        }
        return true;
    }

    autoPlaceShips(shipSizes) {
        this.reset();
        shipSizes.forEach((length, index) => {
            let placed = false;
            while (!placed) {
                const r = Math.floor(Math.random() * this.size);
                const c = Math.floor(Math.random() * this.size);
                const isRotated = Math.random() > 0.5;
                const id = `auto-${length}-${index}`;
                placed = this.placeShip(id, length, r, c, isRotated);
            }
        });
    }
}

class UI {
    constructor() {
        this.board1 = document.getElementById('board1');
        this.board2 = document.getElementById('board2');
        this.frame2 = document.getElementById('frame2');
        this.info = document.querySelector('.info');
        this.playBtn = document.getElementById('play');
        this.resetBtn = document.getElementById('reset');
        this.randomizeBtn = document.getElementById('randomize');
        this.dock = document.getElementById('ship-dock');
    }

    createGrid(element) {
        element.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('board-cell');
            cell.dataset.row = Math.floor(i / 10);
            cell.dataset.col = i % 10;
            element.appendChild(cell);
        }
    }

    updateStatus(msg) {
        this.info.textContent = msg;
    }

    markCell(boardElement, row, col, status) {
        const cell = boardElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
        if (cell) cell.classList.add(status); // 'hit' or 'miss'
    }

    resetDock(shipIds) {
        shipIds.forEach(id => {
            const ship = document.getElementById(id);
            ship.classList.remove('placed', 'rotated');
            ship.style.position = ''; 
            ship.style.left = ''; 
            ship.style.top = '';
            this.dock.appendChild(ship);
        });
    }

    renderShipOnBoard(shipId, row, col, isRotated) {
        const ship = document.getElementById(shipId);
        
        if (isRotated) ship.classList.add('rotated');
        else ship.classList.remove('rotated');
        
        ship.style.position = 'absolute';
        ship.style.left = `${col * 40}px`;
        ship.style.top = `${row * 40}px`;
        ship.classList.add('placed');
        this.board1.appendChild(ship);
    }
}

class BattleshipGame {
    constructor() {
        this.playerBoard = new Gameboard();
        this.computerBoard = new Gameboard();
        this.ui = new UI();
        
        this.isGameActive = false;
        this.computerGuesses = new Set();

        this.init();
    }

    init() {
        this.ui.createGrid(this.ui.board1);
        this.ui.createGrid(this.ui.board2);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const ships = document.querySelectorAll('.ship');
        ships.forEach(ship => {
            ship.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', e.target.id);
                
                // If ship was already placed, remove it from logic
                if (e.target.classList.contains('placed')) {
                    this.playerBoard.removeShip(e.target.id);
                }
            });
        });

        this.ui.board1.addEventListener('dragover', e => e.preventDefault());
        this.ui.board1.addEventListener('drop', this.handleDrop.bind(this));
        this.ui.board1.addEventListener('click', this.handleRotate.bind(this));
        
        this.ui.resetBtn.addEventListener('click', () => location.reload());
        this.ui.randomizeBtn.addEventListener('click', this.handleRandomize.bind(this));
        this.ui.playBtn.addEventListener('click', this.startGame.bind(this));
        
        // Computer board click (Attack)
        this.ui.board2.addEventListener('click', this.handlePlayerAttack.bind(this));
    }

    handleDrop(e) {
        if (this.isGameActive) return;
        e.preventDefault();
        
        const id = e.dataTransfer.getData('text/plain');
        const shipEl = document.getElementById(id);
        if (!shipEl) return;

        const rect = this.ui.board1.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / 40);
        const row = Math.floor(y / 40);
        
        const length = this.getShipLength(id);
        const isRotated = shipEl.classList.contains('rotated');

        const success = this.playerBoard.placeShip(id, length, row, col, isRotated);

        if (success) {
            this.ui.renderShipOnBoard(id, row, col, isRotated);
            if (this.playerBoard.ships.size === 10) this.ui.playBtn.disabled = false;
        }
    }

    handleRotate(e) {
        if (this.isGameActive || !e.target.classList.contains('placed')) return;
        
        const shipEl = e.target;
        const id = shipEl.id;
        const length = this.getShipLength(id);
        
        // Calculate current grid position from style
        const col = parseInt(shipEl.style.left) / 40;
        const row = parseInt(shipEl.style.top) / 40;
        const isCurrentlyRotated = shipEl.classList.contains('rotated');
        const newRotation = !isCurrentlyRotated;

        this.playerBoard.removeShip(id); 
        
        if (this.playerBoard.placeShip(id, length, row, col, newRotation)) {
            // Success: Update UI
            this.ui.renderShipOnBoard(id, row, col, newRotation);
        } else {
            // Fail: Put it back how it was
            this.playerBoard.placeShip(id, length, row, col, isCurrentlyRotated);
        }
    }

    handleRandomize() {
        // 1. Logic: Randomize ships
        const ids = ['sa','sb','sc','sd','se','sf','sg','sh','si','sj']; // simplified for demo
        this.playerBoard.reset();
        this.ui.resetDock(ids);
        
        ids.forEach(id => {
            let placed = false;
            const length = this.getShipLength(id);
            while(!placed) {
                const r = Math.floor(Math.random()*10);
                const c = Math.floor(Math.random()*10);
                const rot = Math.random() > 0.5;
                if(this.playerBoard.placeShip(id, length, r, c, rot)) {
                    this.ui.renderShipOnBoard(id, r, c, rot);
                    placed = true;
                }
            }
        });
        this.ui.playBtn.disabled = false;
    }

    startGame() {
        if (this.playerBoard.ships.size < 10) {
            alert("Place all ships first!");
            return;
        }
        
        // Logic: Setup Computer
        const lengths = [4,3,3,2,2,2,1,1,1,1];
        this.computerBoard.autoPlaceShips(lengths);

        // UI: Update State
        this.isGameActive = true;
        this.ui.playBtn.disabled = true;
        this.ui.randomizeBtn.disabled = true;
        this.ui.dock.classList.add('hidden');
        this.ui.frame2.classList.toggle('hidden');
        this.ui.updateStatus("Game Started! Attack the Enemy!");
    }

    handlePlayerAttack(e) {
        if (!this.isGameActive) return;
        const cell = e.target;
        if (!cell.classList.contains('board-cell')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // 1. Logic: Process Attack
        const outcome = this.computerBoard.receiveAttack(row, col);
        if (!outcome) return; // Already clicked

        // 2. UI: Update Cell
        this.ui.markCell(this.ui.board2, row, col, outcome.result);

        if (outcome.result === 'hit') {
            this.ui.updateStatus("HIT!");
            if (outcome.allSunk) this.endGame(true);
            else setTimeout(() => this.computerTurn(), 500);
        } else {
            this.ui.updateStatus("MISS!");
            setTimeout(() => this.computerTurn(), 500);
        }
    }

    computerTurn() {
        if (!this.isGameActive) return;
        this.ui.updateStatus("Computer is thinking...");

        let r, c, key;
        let valid = false;
        
        // Simple AI
        while (!valid) {
            r = Math.floor(Math.random() * 10);
            c = Math.floor(Math.random() * 10);
            key = `${r},${c}`;
            if (!this.computerGuesses.has(key)) {
                this.computerGuesses.add(key);
                valid = true;
            }
        }

        const outcome = this.playerBoard.receiveAttack(r, c);
        this.ui.markCell(this.ui.board1, r, c, outcome.result);

        if (outcome.result === 'hit' && outcome.allSunk) {
            this.endGame(false);
        } else {
            this.ui.updateStatus("Your Turn!");
        }
    }

    endGame(playerWon) {
        this.isGameActive = false;
        this.ui.updateStatus(playerWon ? "YOU WIN!" : "GAME OVER");
    }

    getShipLength(id) {
        if (id.includes('sa')) return 4;
        if (id.includes('sb') || id.includes('sc')) return 3;
        if (id.includes('sd') || id.includes('se') || id.includes('sf')) return 2;
        return 1;
    }
}

// Start the game
const game = new BattleshipGame();