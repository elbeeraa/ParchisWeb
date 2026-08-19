
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//ANIMACION DE MOVIMIENTO DE FICHA DESDE UNA CELDA A OTRA

export async function animatePieceMovement(game, piece, steps, speed = 100) {

    let remaining = steps;

    while (remaining > 0) {
        // If piece is in final board, move inside final lane with bounce
        if (piece.status === 'finalBoard') {
            const lane = game.board.getFinalLanePositions(piece.player.color);
            if (!lane || lane.length === 0) break;

            const finalLen = lane.length;
            let idx = (piece.finalIndex === null) ? 0 : piece.finalIndex + 1;

            if (idx <= finalLen - 1) {
                piece.finalIndex = idx;
            } else {
                // bounce (reflect) beyond the end
                const exceso = idx - (finalLen - 1);
                piece.finalIndex = (finalLen - 1) - exceso;
                if (piece.finalIndex < 0) piece.finalIndex = 0;
            }

            const pos = game.board.getFinalLanePositions(piece.player.color)[piece.finalIndex];
            if (pos) piece.position = pos;

            // If reached last index, mark goal
            if (piece.finalIndex === finalLen - 1) {
                piece.sendToGoal();
            }

            game.board.render(game.players, game);
            await delay(speed);
            remaining -= 1;
            continue;
        }

        // Move one step on main track
        piece.position = ((piece.position - 1 + 1) % 72) + 1;

        // After moving, check if we hit the gateway for this color
        const gateway = game.board.getGatewayPosition(piece.player.color);
        if (gateway && piece.position === gateway) {
            // enter final lane
            const lane = game.board.getFinalLanePositions(piece.player.color);
            if (lane && lane.length > 0) {
                piece.status = 'finalBoard';
                piece.finalIndex = 0;
                piece.position = lane[0];
                // consume one step for entering
                remaining -= 1;

                // if no remaining steps, render and break
                game.board.render(game.players, game);
                await delay(speed);
                continue;
            }
        }

        game.board.render(game.players, game);
        await delay(speed);
        remaining -= 1;
    }
}


//HACER QUE PARPADEE LA CELDA DONDE SE VA A MOVER LA FICHA
export async function animateCellPulse(cell, speed = 200) {
    if (!cell || !cell.element) return;

    cell.element.classList.add("cell-highlight");

    await new Promise(resolve => setTimeout(resolve, 1200));

    cell.element.classList.remove("cell-highlight");
}