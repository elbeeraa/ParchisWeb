class Piece{
    constructor(id, player, homeRow, homeCol) {
        this.id = id;
        this.player = player;
        this.position = null;
        this.inHome = true;
        
        this.status = "board"; // "board", "finalBoard", "goal"
        this.finalIndex = null; // index inside final lane when status === 'finalBoard'

        
        this.homeRow = homeRow;
        this.homeCol = homeCol;
    }

    move(steps) {
        if (this.inHome || this.status === "goal") return;

        if(this.status === "finalBoard") {
            
        }

        this.position = ((this.position - 1 + steps) % 72) + 1;
    }

    sendToHome() {
        this.position = null;
        this.inHome = true;
    }

    sendToGoal() {
        this.position = null;
        this.inHome = false;
        this.status = "goal";
    }

    sendToPlay(startPosition) {
        this.position = startPosition;
        this.inHome = false;
    }

    getPosition() {
        return this.position;
    }
    
    isInHome() {
        return this.inHome;
    }

    isInPlay() {
        return !this.inHome && this.status !== "goal";
    }

    isInGoal() {
        return this.status === "goal";
    } 

    countPiecesHome(){
        return this.player.pieces.filter(piece => piece.isInHome()).length;
    }

}
