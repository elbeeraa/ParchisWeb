class Game {
	constructor() {
		this.players = [];
		this.currentPlayerIndex = 0;
		this.board = new Board();
		this.currentPlayerElement = document.getElementById('currentPlayer');
		this.diceResultElement = document.getElementById('diceResult');
		this.gameStatusElement = document.getElementById('gameStatus');
		this.rollDiceButton = document.getElementById('rollDiceBtn');
		this.resetButton = document.getElementById('resetBtn');
		this.diceResult = null;

		this.initializePlayers();
		this.bindEvents();
		this.startGame();
	}

	initializePlayers() {

		this.players = [];
		
		const red = new Player(1, 'Rojo', 'red');
		const green = new Player(2, 'Verde', 'green');
		const yellow = new Player(3, 'Amarillo', 'yellow');
		const blue = new Player(4, 'Azul', 'blue');
		
		red.addPiece(new Piece(1, red, 2, 2));
		red.addPiece(new Piece(2, red, 2, 4));
		red.addPiece(new Piece(3, red, 4, 2));
		red.addPiece(new Piece(4, red, 4, 4));

		green.addPiece(new Piece(5, green, 14, 2));
		green.addPiece(new Piece(6, green, 16, 2));
		green.addPiece(new Piece(7, green, 14, 4));
		green.addPiece(new Piece(8, green, 16, 4));

		yellow.addPiece(new Piece(9, yellow, 14, 14));
		yellow.addPiece(new Piece(10, yellow, 14, 16));
		yellow.addPiece(new Piece(11, yellow, 16, 14));
		yellow.addPiece(new Piece(12, yellow, 16, 16));

		blue.addPiece(new Piece(13, blue, 2, 14));
		blue.addPiece(new Piece(14, blue, 4, 14));
		blue.addPiece(new Piece(15, blue, 4, 16));
		blue.addPiece(new Piece(16, blue, 2, 16));

		this.players.push(red, green, yellow, blue);

	}

	bindEvents() {
		this.rollDiceButton.addEventListener('click', () => this.rollDice());
		this.resetButton.addEventListener('click', () => this.resetGame());
	}

	startGame() {
		this.board.initializeBoard();
		this.board.render(this.players);
		this.updateUI();
		this.setStatus('Juego iniciado. Pulsa Tirar Dados.');
	}

	getCurrentPlayer() {
		return this.players[this.currentPlayerIndex];
	}

	rollDice() {

		// Tirar dado.
		// Guardar el resultado en this.diceResult.
		// Hacer clic en una ficha.
		// Mover esa ficha.
		// Actualizar tablero.
		// Pasar turno.


		if (this.diceResult !== null) {
    		return;
		}

		this.diceResult = Math.floor(Math.random() * 6) + 1;

    	this.diceResultElement.textContent = this.diceResult;

    	const player = this.getCurrentPlayer();


		if(this.diceResult === 5 && player.hasPiecesInHome()) {
			this.setStatus(`${player.name} ha sacado un ${this.diceResult}.`);
			const piece = player.pieces.find(
       		piece => piece.isInHome()
   			);
			
			const startPosition = this.board.getStartPosition(player.color);
   			piece.sendToPlay(startPosition);

			this.updateUI();

       		setTimeout(() => {
            	this.nextTurn();
        	}, 1200);

			return;
		}

		if(player.getPiecesInPlay().length === 0) {
			this.setStatus(
        		`${player.name} no puede mover ninguna ficha.`
    		);
			
			this.updateUI();

       		setTimeout(() => {
            	this.nextTurn();
        	}, 1200);
			
			return;
		}

    	this.setStatus(
        	`${player.name} ha sacado un ${this.diceResult}. Selecciona una ficha.`
    	);
	}

	nextTurn() {

		this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

    	this.diceResult = null;

    	this.updateUI();
	}

	updateUI() {
		const currentPlayer = this.getCurrentPlayer();
		this.currentPlayerElement.textContent = currentPlayer.name;
		this.currentPlayerElement.style.borderColor = currentPlayer.color;
		this.currentPlayerElement.style.color = currentPlayer.color;
		this.diceResultElement.textContent = this.diceResult !== null ? this.diceResult : '---';
		this.board.render(this.players,this);
	}

	selectPiece(piece){

		if(piece.isInHome() || piece.isInGoal()) return;
		
		if (this.diceResult === null) {
        	return;
    	}

    	const player = this.getCurrentPlayer();

    	if (piece.player !== player) {
        	return;
    	}

		piece.move(this.diceResult);

    	this.nextTurn();
	}

	setStatus(message) {
		this.gameStatusElement.textContent = `Estado: ${message}`;
	}

	resetGame() {
		this.currentPlayerIndex = 0;
		this.initializePlayers();
		this.board.clearBoard();
		this.board.initializeBoard();
		this.board.render(this.players);
		

		this.diceResultElement.textContent = '---';
		this.updateUI();
		this.setStatus('Juego reiniciado.');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new Game();
});
