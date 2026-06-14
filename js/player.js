class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.pieces = [];
    }

    addPiece(piece) {
        this.pieces.push(piece);
    }

    removePiece(piece) {
        const index = this.pieces.indexOf(piece);
        if (index !== -1) {
            this.pieces.splice(index, 1);
        }
    }
    
    getPiecesInGoal() {
        return this.pieces.filter(piece => piece.isInGoal());
    }

    getPiecesInPlay() {
        return this.pieces.filter(piece => piece.isInPlay());
    }

    getPiecesInHome() {
        return this.pieces.filter(piece => piece.isInHome());
    }

    isDone() {
        return this.getPiecesInGoal().length === 4;
    }

    getCountPiecesInHome() {
        return this.getPiecesInHome().length;
    }
}


