class Board {
    constructor() {
        this.boardElement = document.getElementById('gameBoard');
        this.cells = [];
        this.startPositions = { yellow: 5, green: 22, red: 39, blue: 56};
        this.safeCells = [5, 12, 17, 22, 29, 34, 39, 46, 51, 56, 63, 68];
        //HAY QUE CAMBIAR ESTO O DARLE UNA VUELTA PORQUE LAS CASILLAS FINALES NO TIENEN NUMERO HAY QUE VER COMO SE PLANTEA, ASI QUE HAY QUE CAMBIARLO
        this.goalCells = { green: 17, red: 34, blue: 51, yellow: 68};
    }

    initializeBoard() {
        this.createCells();
        this.renderBoard();
    }

    createCells() {
        this.cells = [];

        for (let i = 1; i <= 68; i++) {
            const cell = {
                position: i,
                element: document.createElement('div'),
                pieces: [],
            };

            cell.element.classList.add('cell');
            cell.element.dataset.index = String(i);
            cell.element.textContent = String(i);

            if (this.isSafeCell(i)) {
                cell.element.classList.add('safe');
            }

            if (this.isStartCell(i)) {
                cell.element.classList.add('start');
            }

            if (this.isGoalCell(i)) {
                cell.element.classList.add('goal');
            }

            this.cells.push(cell);
        }
    }

    renderBoard() {
        if (!this.boardElement) {
            return;
        }

        this.boardElement.innerHTML = '';

        this.cells.forEach(cell => {
            this.boardElement.appendChild(cell.element);
        });
    }

    //DEVUELVE LA CELDA SEGUN LA POSICION, SI NO EXISTE DEVUELVE NULL
    getCell(position) {
        //SE USA || PARA DEVOLVER NULL EN CASO DE QUE NO ENCUENTRE ESA CELDA
        return this.cells.find(cell => cell.position === position) || null;
    }

    //DEVUELVE LA POSICION DE INICIO SEGUN EL COLOR DEL JUGADOR, SI NO EXISTE DEVUELVE NULL
    getStartPosition(color) {
        //SE USA ?? PARA DEVOLVER NULL EN CASO DE QUE NO ENCUENTRE ESA POSICION
        return this.startPositions[color] ?? null;
    }

    //DEVUELVE LA POSICION DE META SEGUN EL COLOR DEL JUGADOR, SI NO EXISTE DEVUELVE NULL
    getGoalPosition(color) {
        return this.goalCells[color] ?? null;
    }


    //PREGUNTA SI LA CELDA ES SEGURA 
    isSafeCell(position) {
        return this.safeCells.includes(position);
    }

    //PREGUNTA SI LA CELDA ES DE INICIO
    isStartCell(position) {
        return Object.values(this.startPositions).includes(position);
    }

    //PREGUNTA SI LA CELDA ES DE META
    isGoalCell(position) {
        return Object.values(this.goalCells).includes(position);
    }

    clearBoard() {
        this.cells = [];

        if (this.boardElement) {
            this.boardElement.innerHTML = '';
        }
    }
}
