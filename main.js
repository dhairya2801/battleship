/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("{// TODO:\n// 1. when a ship is placed; \n// - disable the surrounding cells\n// 2. handle ship edge cases\n// - overflowing outside the board\n// - overlapping on other ships\n// - being placed on adjacent cells\n// 3. add reset and randomize buttons\n// 4. make a test run\n\nconst boards = document.getElementById('boards');\nconst board1 = document.getElementById('board1');\nconst board2 = document.getElementById('board2');\nconst frame2 = document.getElementById('frame2');\nconst shipDock = document.getElementById('ship-dock');\n\ncreateBoard(board1);\ncreateBoard(board2);\nrandomizeComputer();\n\nfunction createBoard(board) {\n    for (let i=0; i<100; i++) {\n        const cell = document.createElement('div');\n        cell.classList.add('board-cell');\n        cell.dataset.row = Math.floor(i / 10);\n        cell.dataset.col = i % 10;\n        board.appendChild(cell);\n    }\n}\n\nconst ships = document.querySelectorAll('.ship');\nships.forEach(ship => {\n    ship.addEventListener('dragstart', (e) => {\n        e.dataTransfer.setData('text/plain', e.target.id);\n    })\n});\n\nboard1.addEventListener('dragover', (e) => {\n    e.preventDefault();\n})\n\nboard1.addEventListener('drop', (e) => {\n    e.preventDefault();\n    // getBoundingClientRect gives the position of board1 relative to the viewport\n    const x = e.clientX - board1.getBoundingClientRect().left;\n    const y = e.clientY - board1.getBoundingClientRect().top;\n    \n    // to convert mouse's window coordinates (clientX, Y) into the board1's grid\n    // coordinates.\n    const snapLeft = Math.floor(x/40) * 40;\n    const snapTop = Math.floor(y/40) * 40;\n        \n    const id = e.dataTransfer.getData('text/plain');\n    const draggableElement = document.getElementById(id);\n    board1.appendChild(draggableElement);\n\n    draggableElement.style.position = 'absolute';\n    draggableElement.style.left = `${snapLeft}px`;\n    draggableElement.style.top = `${snapTop}px`;\n\n    // add placed class\n    draggableElement.classList.add('placed');\n    // store coordinates\n    setShip(snapLeft/40, snapTop/40, draggableElement);\n})\n\nboard1.addEventListener('click', (e) => {\n    if (e.target.classList.contains('placed')) {\n        const shipEle = e.target;\n        shipEle.classList.toggle('rotated');\n        setShip(parseInt(shipEle.style.left.slice(0, -2), 10)/40, \n            parseInt(shipEle.style.top.slice(0, -2), 10)/40, shipEle);\n    }\n})\n\nconst shipCoords1 = new Map();\nconst shipCoords2 = new Map();\n\nfunction setShip(left, top, ele) {\n    const id = ele.id;\n    const isRotated = ele.classList.contains('rotated');\n    let length = 0;\n    shipCoords1.set(id, []);\n    \n    if (id === \"sa\") {length = 4;}\n    else if (id === \"sb\" || id === \"sc\") {length = 3;}\n    else if (id === \"sd\" || id === \"se\" || id === \"sf\") {length = 2;}\n    else {length = 1;}\n    \n    for (let i=0; i<length; i++) {\n        if (isRotated) {\n            shipCoords1.get(id).push([top+i, left]);\n        }\n        else {\n            shipCoords1.get(id).push([top, left+i]);\n        }\n    }\n}\n\nconst playBtn = document.getElementById('play');\nconst info = document.querySelector('.info');\nplayBtn.addEventListener('click', () => {\n    frame2.classList.toggle('hidden');\n    shipDock.classList.toggle('hidden');\n    info.textContent = 'Your turn. Fire on the computer\\'s board.';\n    if (shipCoords1.size === 10) {\n        startGame();\n    }\n})\n\nfunction startGame() {\n    \n}\n\nfunction randomizeComputer() {\n\n}\n\n//# sourceURL=webpack:///./src/index.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;