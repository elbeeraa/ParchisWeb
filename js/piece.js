class Piece{
    constructor(id, player) {
        this.id = id;
        this.player = player;
        this.position = null;
        this.inHome = true;
        this.inGoal = false;
    }

    move(steps) {
        if(!this.inHome && !this.inGoal) {
            this.position += steps;
        }
    }

    sendToHome() {
        this.position = null;
        this.inHome = true;
        this.inGoal = false;
    }

    sendToGoal() {
        this.position = null;
        this.inHome = false;
        this.inGoal = true;
    }

    sendToPlay(startPosition) {
        this.position = startPosition;
        this.inHome = false;
        this.inGoal = false;
    }

    getPosition() {
        return this.position;
    }
    
    isInHome() {
        return this.inHome;
    }

    isInPlay() {
        return !this.inHome && !this.inGoal;
    }

    isInGoal() {
        return this.inGoal;
    } 

}
