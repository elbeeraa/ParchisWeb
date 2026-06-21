
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//ANIMACION DE MOVIMIENTO DE FICHA DESDE UNA CELDA A OTRA

export async function animatePieceMovement(game, piece, steps, speed = 200) {

    for (let i = 0; i < steps; i++) {

        piece.position = ((piece.position - 1 + 1) % 72) + 1;

        // SOLO actualizar tablero UNA VEZ por frame
        game.board.render(game.players, game);

        await delay(speed);
    }
}

//ANIMACION DE SALIDA DE CASA
export async function animatePieceStart(game, piece, startPosition, speed = 250) {

    piece.position = startPosition;
    piece.inHome = false;

    game.board.render(game.players, game);

    await delay(speed);
}

//ANIMACION DE MANDAR A CASA
export async function animatePieceToHome(game, piece, speed = 200) {

    // 1. coger el elemento DOM de la ficha
    const dom = game.board.getPieceElement?.(piece);

    if (dom) {
        dom.classList.add("captured");
    }

    // 2. pequeño delay para que se vea el “golpe”
    await new Promise(resolve => setTimeout(resolve, speed));

    // 3. cambiar estado lógico
    piece.sendToHome();

    // 4. refrescar tablero
    game.board.render(game.players, game);

    // 5. quitar animación (por si reutilizas DOM)
    if (dom) {
        dom.classList.remove("captured");
    }
}