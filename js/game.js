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
		this.players = [
			new Player(1, 'Rojo', 'red'),
			new Player(2, 'Verde', 'green'),
			new Player(3, 'Amarillo', 'yellow'),
			new Player(4, 'Azul', 'blue')
		];

		this.players.forEach(player => {
			for (let i = 1; i <= 4; i++) {
				player.addPiece(new Piece(i, player));
			}
		});
	}

	bindEvents() {
		this.rollDiceButton.addEventListener('click', () => this.rollDice());
		this.resetButton.addEventListener('click', () => this.resetGame());
	}

	startGame() {
		this.board.initializeBoard();
		this.board.render();
		this.updateUI();
		this.setStatus('Juego iniciado. Pulsa Tirar Dados.');
	}

	getCurrentPlayer() {
		return this.players[this.currentPlayerIndex];
	}

	rollDice() {
		const result = Math.floor(Math.random() * 6) + 1;
		this.diceResultElement.textContent = result;
		this.setStatus(`${this.getCurrentPlayer().name} ha sacado un ${result}.`);
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
	}

	setStatus(message) {
		this.gameStatusElement.textContent = `Estado: ${message}`;
	}

	resetGame() {
		this.currentPlayerIndex = 0;
		this.initializePlayers();
		this.board.clearBoard();
		this.board.initializeBoard();
		this.board.render();

		this.diceResultElement.textContent = '---';
		this.updateUI();
		this.setStatus('Juego reiniciado.');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new Game();
});


