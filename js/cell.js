class Cell{
    constructor(row, col, type = "blocked-cell") {
        this.row = row;
        this.col = col;
        this.type = type;
        this.position = null;
        this.safe = false;
        this.startColor = null;
        this.goalColor = null;
    }


}