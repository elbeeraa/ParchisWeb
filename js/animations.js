
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//ANIMACION DE MOVIMIENTO DE FICHA DESDE UNA CELDA A OTRA

export async function animatePieceMovement(game, piece, steps, speed = 100) {

    for (let i = 0; i < steps; i++) {

        piece.position = ((piece.position - 1 + 1) % 72) + 1;

        // SOLO actualizar tablero UNA VEZ por frame
        game.board.render(game.players, game);

        await delay(speed);
    }
}


//HACER QUE PARPADEE LA CELDA DONDE SE VA A MOVER LA FICHA
export async function animateCellPulse(cell, speed = 200) {
    if (!cell || !cell.element) return;

    cell.element.classList.add("cell-highlight");

    await new Promise(resolve => setTimeout(resolve, 1200));

    cell.element.classList.remove("cell-highlight");
}