class Board {
    constructor() {
        this.boardElement = document.getElementById('gameBoard');
        this.cells = [];
        this.gridSize = 19;
        this.center = { row: 9, col: 9 };
        this.startPositions = { red: 18, blue: 36, green: 54, yellow: 72 };
        this.safeCells = [18, 22, 36, 40, 54, 58, 67, 72];
        this.goalCells = { red: 'center', blue: 'center', green: 'center', yellow: 'center' };
        this.trackPath = this.buildTrackPath();
        this.trackLookup = new Map(this.trackPath.map(cell => [this.key(cell.row, cell.col), cell]));
    }

    initializeBoard() {
        this.createCells();
    }

    createCells() {
        this.cells = [];

        if (!this.boardElement) {
            return;
        }

        this.boardElement.innerHTML = '';

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.createCell(row, col);
                this.cells.push(cell);
                this.boardElement.appendChild(cell.element);
            }
        }
    }

    createCell(row, col) {
        const element = document.createElement('div');
        const cell = {
            position: null,
            row,
            col,
            key: this.key(row, col),
            element,
            pieces: [],
        };

        element.classList.add('cell');
        element.style.gridRow = String(row + 1);
        element.style.gridColumn = String(col + 1);
        element.dataset.row = String(row + 1);
        element.dataset.col = String(col + 1);

        const houseColor = this.getHouseColor(row, col);
        if (houseColor) {
            cell.key = `house-${houseColor}-${row}-${col}`;
            element.classList.add('home-cell', `home-${houseColor}`);
            element.dataset.zone = 'home';
            return cell;
        }

        if (this.isCenterGoal(row, col)) {
            cell.position = 'center';
            cell.key = 'center';
            element.classList.add('center-cell', 'center-goal');
            element.dataset.zone = 'center';
            return cell;
        }

        const laneColor = this.getLaneColor(row, col);
        if (laneColor) {
            cell.key = `lane-${laneColor}-${row}-${col}`;
            element.classList.add('lane-cell', `lane-${laneColor}`);
            element.dataset.lane = laneColor;
            return cell;
        }

        const trackCell = this.trackLookup.get(this.key(row, col));
        if (trackCell) {
            cell.position = trackCell.position;
            cell.key = String(trackCell.position);
            element.dataset.index = String(trackCell.position);
            element.textContent = String(trackCell.position);
            element.classList.add('track-cell');

            if (trackCell.safe) {
                element.classList.add('safe');
            }

            if (trackCell.startColor) {
                element.classList.add('start', `start-${trackCell.startColor}`);
            }

            return cell;
        }

        cell.key = `background-${row}-${col}`;
        element.classList.add('blocked-cell');
        element.dataset.zone = 'blocked';
        return cell;
    }

    buildTrackPath() {
        const coords = [
            [18, 9], [17, 9], [16, 9], [15, 9], [14, 9], [13, 9], [12, 9], [11, 9],
            [10, 9], [10, 10], [10, 11], [10, 12], [10, 13], [10, 14], [10, 15], [10, 16],
            [10, 17], [10, 18], [9, 18], [8, 18], [7, 18], [6, 18], [5, 18], [4, 18],
            [3, 18], [2, 18], [1, 18], [0, 18], [0, 17], [0, 16], [0, 15], [0, 14],
            [0, 13], [0, 12], [0, 11], [0, 10], [0, 9], [0, 8], [1, 8], [2, 8],
            [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [9, 7], [9, 6],
            [9, 5], [9, 4], [9, 3], [9, 2], [9, 1], [9, 0], [10, 0], [11, 0], [12, 0],
            [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [18, 1], [18, 2], [18, 3],
            [18, 4], [18, 5], [18, 6], [18, 7], [18, 8]
        ];

        return coords.map(([row, col], index) => {
            const position = index + 1;
            const startColor = Object.entries(this.startPositions).find(([, start]) => start === position)?.[0] ?? null;
            return {
                row,
                col,
                position,
                safe: this.safeCells.includes(position),
                startColor,
            };
        });
    }

    getLaneColor(row, col) {
        if (col === 9 && row >= 1 && row <= 8) {
            return 'red';
        }

        if (row === 9 && col >= 10 && col <= 17) {
            return 'blue';
        }

        if (col === 9 && row >= 10 && row <= 17) {
            return 'yellow';
        }

        if (row === 9 && col >= 1 && col <= 8) {
            return 'green';
        }

        return null;
    }

    isCenterGoal(row, col) {
        return row === this.center.row && col === this.center.col;
    }

    getHouseColor(row, col) {
        if (row <= 6 && col <= 6) {
            return 'red';
        }

        if (row <= 6 && col >= 12) {
            return 'blue';
        }

        if (row >= 12 && col <= 6) {
            return 'green';
        }

        if (row >= 12 && col >= 12) {
            return 'yellow';
        }

        return null;
    }

    key(row, col) {
        return `${row}-${col}`;
    }

    renderBoard() {
        return;
    }

    //DEVUELVE LA CELDA SEGUN LA POSICION, SI NO EXISTE DEVUELVE NULL
    getCell(position) {
        return this.cells.find(cell => cell.position === position || cell.key === String(position)) || null;
    }

    //DEVUELVE LA POSICION DE INICIO SEGUN EL COLOR DEL JUGADOR, SI NO EXISTE DEVUELVE NULL
    getStartPosition(color) {
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
