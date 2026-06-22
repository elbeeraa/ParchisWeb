    // import { animatePieceMovement } from "./animations.js";
    
    // export function canMove(game, piece, diceResult) {

	// 	//VALIDA SI LA POSICION FINAL DE LA FICHA ES UNA CELDA SEGURA Y SI HAY MAS DE 2 FICHAS EN ESA CELDA

	// 	//TODO HACER QUE VALIDE SI HAY PUENTES	

    // 	const newPosition = calculateNewPosition(piece, diceResult);

    // 	// Fichas en esa posición
    // 	const piecesInCell = game.players
    //     	.flatMap(player => player.pieces)
    //     	.filter(other =>

    //         other.position === newPosition &&
    //         other.isInPlay()

    //     );

    // 	return piecesInCell.length < 2;
	// }


    // export async function moveSelectedPiece(game, player, piece) {
    //         // piece.move(this.diceResult);\
    //         await animatePieceMovement(game, piece, game.diceResult);
    
    //         const hasKilled = await game.checkKill(piece);
    
    //         game.updateUI();
    
    //         if(hasKilled) {
    //             return;
    //         }
    
    //         game.checkWin(piece);
    
    //         //GESTIONA EL SIGUIENTE TURNO
    //         game.handleNextTurnAfterMove(player);
    //     }

    // export function calculateNewPosition(piece, diceResult) {
    //      return ((piece.position - 1 + diceResult) % 72) + 1;
    // }