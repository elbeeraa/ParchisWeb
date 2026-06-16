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
		const result = Math.floor(Math.random() * 6) + 1;
		this.diceResultElement.textContent = result;
		const player = this.getCurrentPlayer();
		this.setStatus(`${player.name} ha sacado un ${result}.`);
		if(result === 5 && player.hasPiecesInHome()) {
			const piece = player.pieces.find(
       		piece => piece.isInHome()
   			);
			
			const startPosition = this.board.getStartPosition(player.color);
   			piece.sendToPlay(startPosition);

    		this.updateUI();

			this.nextTurn();
			return;
		}


		this.nextTurn();
	}

	nextTurn() {
		this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
		this.updateUI();
	}

	updateUI() {
		const currentPlayer = this.getCurrentPlayer();
		this.currentPlayerElement.textContent = currentPlayer.name;
		this.currentPlayerElement.style.borderColor = currentPlayer.color;
		this.currentPlayerElement.style.color = currentPlayer.color;
		this.board.render(this.players);
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
