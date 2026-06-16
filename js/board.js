class Board {
    constructor() {
        this.cells = [];
        this.gridSize = 19;
    }

    initializeBoard() {
        this.createCells();
        this.assignTrack();
        this.assignSafeCells();
        this.assignStartCells();
        this.assignGoalLanes();
    }

    createCells() {

        // ITS ONLY CREATING CELLS FOR THE TRACK AND HOMES, NOT FOR THE ENTIRE GRID
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {

                let type = "blocked-cell";

                if (row <= 6 && col <= 6) {
                    type = "home-red";
                }

                else if (row <= 6 && col >= 12) {
                    type = "home-blue";
                }

                else if (row >= 12 && col <= 6) {
                    type = "home-green";
                }

                else if (row >= 12 && col >= 12) {
                    type = "home-yellow";
                }

                else if (row === 9 && col === 9) {
                    type = "goal";
                }

                this.cells.push(
                    new Cell(row, col, type)
                );
            }
        }
    }

    assignTrack() {
        const track = [

            [18,10],[17,10],[16,10],[15,10],[14,10],[13,10],[12,10],[11,10],[10,10],
            [10,11],[10,12],[10,13],[10,14],[10,15],[10,16],[10,17],[10,18],
            [9,18],[8,18],
            [8,17],[8,16],[8,15],[8,14],[8,13],[8,12],[8,11],[8,10],
            [7,10],[6,10],[5,10],[4,10],[3,10],[2,10],[1,10],[0,10],
            [0,9],[0,8],
            [1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],
            [8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
            [9,0],[10,0],
            [10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7],[10,8],
            [11,8],[12,8],[13,8],[14,8],[15,8],[16,8],[17,8],[18,8],
            [18,9]
        ];

        track.forEach(([row, col], index) => {
            const cell = this.getCellByCoords(row, col);
            cell.type = "track";
            cell.position = index + 1;
        });
    }

    assignSafeCells() {
        const safePositions = [5, 14, 18, 22, 32, 36, 40, 50, 54, 58, 67, 72];
        safePositions.forEach(position => {
            const cell = this.getCellByPosition(position);
            if (cell) {
                cell.safe = true;
            }
        });
    }

    assignStartCells() {
        this.getCellByPosition(5).startColor = "yellow";
        this.getCellByPosition(22).startColor = "blue";
        this.getCellByPosition(58).startColor = "green";
        this.getCellByPosition(40).startColor = "red";
    }

    assignGoalLanes() {
        this.getCellByCoords(9, 9).goalColor = "purple";
    }

    getStartPosition(color) {

         const cell = this.cells.find(
            cell => cell.startColor === color
        );

        return cell ? cell.position : null;
    }

    getCellByCoords(row, col) {
        return this.cells.find(
            cell => cell.row === row && cell.col === col
        );
    }

    getCellByPosition(position) {
        return this.cells.find(cell => cell.position === position);
    }

    render(players,game) {

        const board = document.getElementById("gameBoard");

        board.innerHTML = "";

        this.cells.forEach(cell => {

            const div = document.createElement("div");

            div.classList.add("cell");
            div.classList.add(cell.type);
            cell.element = div;
            //PARA QUE PUEDA SABER EN QUE COL Y FILA ESTA CADA CELDA
            div.style.gridRow = cell.row + 1;
            div.style.gridColumn = cell.col + 1;

            if (cell.type === "track") {
                div.textContent = cell.position;
            }

            if (cell.safe) {
                 div.classList.add("safe");
            }

            if (cell.startColor) {
                div.classList.add("start");
                div.classList.add(`${cell.startColor}`);
            }

            if (cell.goalColor) {
                div.classList.add("goal");
            }

            board.appendChild(div);

        });

        this.renderPieces(players,game);

    }

    renderPieces(players,game) {
        players.forEach(player => {

             player.pieces.forEach(piece => {

                let cell;

                // FICHA EN CASA
                if (piece.position === null) {

                    cell = this.getCellByCoords(
                        piece.homeRow,
                        piece.homeCol
                    );
                }

                // FICHA EN EL RECORRIDO
                 else {

                    cell = this.cells.find(
                        c => c.position === piece.position
                    );
                    
                }

                if (!cell) return;

                const pieceDiv = document.createElement("div");

                pieceDiv.classList.add("piece");
                pieceDiv.classList.add(player.color);
                
                pieceDiv.addEventListener("click", () => {
                    game.selectPiece(piece);
                });

                // pieceDiv.textContent = piece.id;

                cell.element.appendChild(pieceDiv);

            });
        });
    }

    clearBoard() {
        this.cells = [];

        if (this.boardElement) {
            this.boardElement.innerHTML = '';
        }
    }
}
