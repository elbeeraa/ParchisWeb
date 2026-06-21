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

		this.numberCounter = 0;
		this.mustSelectPieceToHome = false;

		this.mustSelectPieceAdvantage = false;
		

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

	setStatus(message) {
		this.gameStatusElement.textContent = `Estado: ${message}`;
	}

	rollDice() {

		if (this.diceResult !== null) {
    		return;
		}

		this.diceResult = Math.floor(Math.random() * 6) + 1;

    	this.diceResultElement.textContent = this.diceResult;

    	const player = this.getCurrentPlayer();
		const startPosition = this.board.getStartPosition(player.color);

		if(this.checkTripleSix(player)) {
			return;
		}

		if(this.diceResult === 5 && player.hasPiecesInHome() && this.canPieceStart(startPosition)) {
			this.setStatus(`${player.name} ha sacado un ${this.diceResult}.`);
			const piece = player.pieces.find(
       		piece => piece.isInHome()
   			);
			
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

	checkTripleSix(player) {

		if (this.diceResult !== 6) {
        	return false;
    	}

    	this.numberCounter++;

    	if (this.numberCounter === 3) {

        	this.mustSelectPieceToHome = true;

        	this.diceResult = null;

        	this.setStatus(`${player.name} ha sacado 3 veces 6. Selecciona una ficha para enviarla a casa.`);

        	return true;
    	}

    	return false;
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

	canPieceStart(startPosition) {
		//TODAS LAS FICHAS EN LA POSICION DE SALIDA DESEADA
		const piecesInStartCell = this.players
        .flatMap(player => player.pieces)
        .filter(piece =>

            piece.position === startPosition &&
            piece.isInPlay()

        );

    	const currentPlayer = this.getCurrentPlayer();

    	// FICHAS QUE SON DE ESA SALIDA
    	const ownPieces = piecesInStartCell.filter(
        	piece => piece.player === currentPlayer
    	);

    	// FICHAS ENEMIGAS EN ESA POSICION DE SALIDA
    	const enemyPieces = piecesInStartCell.filter(
        	piece => piece.player !== currentPlayer
    	);

    	// PUENTE 
    	if (ownPieces.length === 2) {
        	return false;
    	}

    	// COME UNA DE LAS FICHAS ENEMIGAS
    	if (enemyPieces.length > 0 && piecesInStartCell.length === 2) {

        	enemyPieces[0].sendToHome();

    	}

   		return true;
	}

	canMove(piece, steps) {

		//VALIDA SI LA POSICION FINAL DE LA FICHA ES UNA CELDA SEGURA Y SI HAY MAS DE 2 FICHAS EN ESA CELDA

		//TODO HACER QUE VALIDE SI HAY PUENTES	

    	const newPosition =
       		((piece.position - 1 + steps) % 72) + 1;

    	// Fichas en esa posición
    	const piecesInCell = this.players
        	.flatMap(player => player.pieces)
        	.filter(other =>

            other.position === newPosition &&
            other.isInPlay()

        );

    	return piecesInCell.length < 2;
	}

	selectPiece(piece){

		const player = this.getCurrentPlayer();

		//CASTIGOS
		//-------------------------------

		//castigo de 3 seises
		if(this.mustSelectPieceToHome) {
			this.handleTripleSixPenalty(player, piece);
			return;
		}

		//VENTAJAS
		//-------------------------------
		if(this.mustSelectPieceAdvantage) {
			this.handleMoveAdvantage(piece, player);
			return;
		}

		// VALIDACIÓN 
		// HAY DADO, JUGADOR ACTUAL, QUE NO ESTE EN CASA NI META
		if(!this.canSelectPiece(player, piece)) {
			return;	
		}

		//MOVIMIENTO DE LA FICHA
		this.moveSelectedPiece(player, piece);
		
	}

	handleMoveAdvantage(piece, player) {

		if (piece.player !== player) {
        	return;
    	}

    	if (piece.isInHome() || piece.isInGoal()) {
        	return;
    	}

    	if (!this.canMove(piece, 20)) {

        	this.setStatus("No puedes mover esa ficha 20 casillas.");

        	return;
    	}

    	piece.move(20);

    	this.mustSelectPieceAdvantage = false;

    	this.updateUI();

		// MIRAR SI FUINCIONA CORRECTAMENTE
    	this.handleNextTurnAfterMove(player);
	}

	canSelectPiece(player, piece) {

		if(piece.isInHome() || piece.isInGoal()) return false;

    	if (this.diceResult === null) return false;

    	if (piece.player !== player) return false;

    	if(!this.canMove(piece, this.diceResult)) {

        	this.setStatus(`${player.name} no puede mover la ficha ${piece.id}.`);
        	return false;
		}

		return true;

	}

	handleTripleSixPenalty(player, piece) {
		piece.sendToHome();

    	this.mustSelectPieceToHome = false;

    	this.numberCounter = 0;

    	this.setStatus(`${player.name} ha enviado una ficha a casa.`);

    	this.nextTurn();
	}

	moveSelectedPiece(player, piece) {
		piece.move(this.diceResult);

		const hasKilled = this.checkKill(piece);

		this.updateUI();

		if(hasKilled) {
			return;
		}

		this.checkWin(piece);


		//GESTIONA EL SIGUIENTE TURNO
		this.handleNextTurnAfterMove(player);
	}

	handleNextTurnAfterMove(player) {
		//SI SACA UN 6, PUEDE VOLVER A TIRAR, SI NO, PASA AL SIGUIENTE JUGADOR
		if(this.diceResult === 6) {
			this.setStatus(`${player.name} ha sacado un 6. Puede volver a tirar.`);
			this.diceResult = null;
			this.updateUI();
			return;
		}

		this.numberCounter = 0;
		this.nextTurn();
	}


	checkKill(piece) {

		//PRIMERO SELECCIONAMOS TODAS LAS FICHAS DEL JUEGO CON FLATMAP Y LUEGO CON FIND BUSCAMOS CON LAS CONDICIONES.
		const enemyPiece = this.players
    		.flatMap(player => player.pieces)
    		.find(other =>

       			other !== piece &&
       			other.position === piece.position &&
        		other.player !== piece.player

    	);

		if(enemyPiece && !this.checkSafeCell(enemyPiece.position)) {
			this.setStatus(`${piece.player.name} ha matado a una ficha de ${enemyPiece.player.name}. Selecciona una ficha para mover 20 casillas.`);
			enemyPiece.sendToHome();
			this.mustSelectPieceAdvantage = true;
			return true;
		}

		return false;
		
	}

	//TODO TODA LA LOGICA DE GANAR EL JUEGO
	checkWin(piece) {
		if(piece.isInGoal()) {
			this.setStatus(`${piece.player.name} ha ganado el juego!`);
			this.rollDiceButton.disabled = true;
		}
	}


	checkSafeCell(position) {
    	return this.board.isSafeCell(position);
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
