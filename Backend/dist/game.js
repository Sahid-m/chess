"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.MoveCounter = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            color: "white",
        }));
        this.player2.send(JSON.stringify({
            color: "black",
        }));
    }
    makeMove(socket, move) {
        // Check if valid player sends move
        if (this.MoveCounter % 2 === 0 && socket !== this.player1) {
            socket.send("not your turn");
            return;
        }
        ;
        if (this.MoveCounter % 2 === 1 && socket !== this.player2) {
            socket.send("not your turn");
            return;
        }
        ;
        // updates the board and add moves
        try {
            this.board.move(move);
            socket.send("valid move");
        }
        catch (e) {
            console.log(e);
            socket.send("invalid move");
            return;
        }
        // Checks if game over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white',
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white',
                }
            }));
            return;
        }
        // Sends Move to users
        if (this.MoveCounter % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        this.MoveCounter++;
    }
}
exports.Game = Game;
