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
        this.player1.socket.send(JSON.stringify({
            type: messages_1.STARTED,
            color: "white",
            name: this.player2.name
        }));
        this.player2.socket.send(JSON.stringify({
            type: messages_1.STARTED,
            color: "black",
            name: this.player1.name
        }));
    }
    makeMove(socket, move) {
        // Check if valid player sends move
        if (this.MoveCounter % 2 === 0 && socket !== this.player1.socket) {
            return;
        }
        ;
        if (this.MoveCounter % 2 === 1 && socket !== this.player2.socket) {
            return;
        }
        ;
        // updates the board and add moves
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        // Checks if game over
        if (this.board.isGameOver()) {
            this.player1.socket.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? this.player2.name : this.player1.name,
                }
            }));
            this.player2.socket.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? this.player2.name : this.player1.name,
                }
            }));
            return;
        }
        // Sends Move to users
        if (this.MoveCounter % 2 === 0) {
            this.player2.socket.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    turn: true
                }
            }));
        }
        else {
            this.player1.socket.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    turn: true
                }
            }));
        }
        this.MoveCounter++;
    }
}
exports.Game = Game;
